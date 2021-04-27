// This function is responsible for archiving events and should be activated with triggers on required collections
exports = async function(dbEvent) {
  const id = dbEvent.documentKey._id
  const dbName = dbEvent.ns.db
  const collectionName = dbEvent.ns.coll
  const collection = context.services.get("prod").db(dbName).collection("archived-" + collectionName)
  let event = dbEvent.fullDocument
  // On deletion do not delete archived event but tag it with deletion date
  if (dbEvent.operationType.toLowerCase() == "delete")
  {
    await collection.updateOne({ _id: id }, { $set: { deletedAt: new Date() } })
  }
  else
  {
    // Try to categorize event to the best matching template
    if (!event.template) {
      const templateCollection = context.services.get("prod").db(dbName).collection("event-templates")
      const results = await templateCollection.find(
         { $text: { $search: event.name } },
         { score: { $meta: "textScore" } }
      ).sort( { score: { $meta: "textScore" } } ).toArray()
      if (results.length > 0) {
        event.template = results[0].name
      }
    }
    // Delete or anonymize required fields when the target is a person
    if (event.participants && Array.isArray(event.participants)) {
      event.participants.forEach(participant => {
        if (participant.email || participant.profile) {
          delete participant.name
          delete participant.email
          delete participant.profile
        }
      })
    }
    if (event.coordinators && Array.isArray(event.coordinators)) {
      event.coordinators.forEach(coordinator => {
        if (coordinator.email || coordinator.profile) {
          delete coordinator.name
          delete coordinator.email
          delete coordinator.profile
        }
      })
    }
    await collection.findOneAndReplace({ _id: id }, event, { upsert: true, returnNewDocument: true })
  }
}
