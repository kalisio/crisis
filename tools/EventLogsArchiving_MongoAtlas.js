// This function is responsible for archiving event logs and should be activated with triggers on required collections
exports = async function(dbEvent) {
  const id = dbEvent.documentKey._id
  const dbName = dbEvent.ns.db
  const collectionName = dbEvent.ns.coll
  const collection = context.services.get("aktnmap-prod").db(dbName).collection("archived-" + collectionName)
  const log = dbEvent.fullDocument
  // On deletion do not delete archived event but tag it with deletion date
  if (dbEvent.operationType.toLowerCase() == "delete")
  {
    await collection.updateOne({ _id: id }, { $set: { deletedAt: new Date() } })
  }
  else
  {
    // Delete or anonymize required fields
    //delete log.participant
    await collection.findOneAndReplace({ _id: id }, log, { upsert: true, returnNewDocument: true })
  }
}
