const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addManualFarmer = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check: Ensure the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // 2. Role Check: Ensure the user has a permitted role.
  const allowedRoles = ["Extension Worker", "Branch Coordinator", "Administrator"];
  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || !allowedRoles.includes(userDoc.data().role)) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "This function can only be called by a user with a permitted role."
      );
  }

  // 3. Data Validation: Ensure the incoming data is valid.
  const { fullName, province, municipality, barangay, birthdate, civilStatus, religion, yearsFarming, familyMembers, education, rsbsaNumber } = data;
  if (!fullName || !province || !municipality || !barangay || !birthdate || !civilStatus || !religion || !yearsFarming || !familyMembers || !education) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with all required farmer data fields."
    );
  }

  // 4. Construct Farmer Data
  const farmerData = {
    fullName,
    province,
    municipality,
    barangay,
    birthdate,
    civilStatus,
    religion,
    yearsFarming: parseInt(yearsFarming, 10),
    familyMembers: parseInt(familyMembers, 10),
    education,
    rsbsaNumber: rsbsaNumber || '',
    role: 'Farmer',
    isManual: true,
    managedBy: context.auth.uid, // Link to the Extension Worker
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // 5. Create the new farmer document in Firestore.
  try {
    const newFarmerRef = await admin.firestore().collection("users").add(farmerData);
    console.log(`Successfully created manual farmer ${newFarmerRef.id} by EW ${context.auth.uid}`);
    return { success: true, farmerId: newFarmerRef.id };
  } catch (error) {
    console.error("Error creating manual farmer:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while creating the farmer."
    );
  }
});
