// This function is responsible for archiving events and should be activated with triggers on required collections
exports = async function(dbEvent) {
  const id = dbEvent.documentKey._id
  const dbName = dbEvent.ns.db
  const collectionName = dbEvent.ns.coll
  const collection = context.services.get("prod").db(dbName).collection("archived-" + collectionName)
  let plan = dbEvent.fullDocument
  // On deletion do not delete archived event but tag it with deletion date
  if (dbEvent.operationType.toLowerCase() == "delete")
  {
    await collection.updateOne({ _id: id }, { $set: { deletedAt: new Date() } })
  }
  else
  {
    // Try to categorize plan to the best matching template
    if (!plan.template) {
      const templateCollection = context.services.get("prod").db(dbName).collection("plan-templates")
      const results = await templateCollection.find(
         { $text: { $search: plan.name } },
         { score: { $meta: "textScore" } }
      ).sort( { score: { $meta: "textScore" } } ).toArray()
      if (results.length > 0) {
        plan.template = results[0].name
      }
    }
    // Delete or anonymize required fields when the target is a person
    if (plan.coordinators && Array.isArray(plan.coordinators)) {
      plan.coordinators.forEach(coordinator => {
        if (coordinator.email || coordinator.profile) {
          delete coordinator.name
          delete coordinator.email
          delete coordinator.profile
        }
      })
    }
    await collection.findOneAndReplace({ _id: id }, plan, { upsert: true, returnNewDocument: true })
  }
}
