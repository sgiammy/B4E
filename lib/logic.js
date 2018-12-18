
/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.bfore.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo){
    const factory = getFactory();
    const NS = 'org.bfore';

    //create a student
    const student = factory.newResource(NS, 'Student','studentA@email.com');
    student.firstName = 'Student';
    student.lastName = 'A'; 
    const studentAddress = factory.newConcept(NS,'Address');
    studentAddress.city = 'Washington DC';
    studentAddress.country = 'USA';
    studentAddress.street = '3222 Northampton Street';
    studentAddress.zip = '20015';
    student.address = studentAddress; 
    student.educoinBalance = 0;

    const studentRegistry = await getParticipantRegistry(NS + '.Student');
    await studentRegistry.addAll([student]) ; 
    var counter = 0; 
    var act_counter = 0;
    var campaignNames = ['Social Innovation and Development',  'Entrepreneurship and New Venture'];
    var campaignDescriptions = ['The goal of the program to help students build changemaking skills',  'Entrepreneurship education benefits students from all socioeconomic backgrounds because it teaches kids to think outside the box'];
  
   var missionNames = ['Fight World Hunger', 'You Create'];
   var missionDescriptions = ['For students interested in exploring innovative ways to tackle the world s most pressing social challenges and improving livelihoods for low-income populations domestically and internationally.', 'Think about a product that they would love to invent and review some of the basics of the invention process.'];
  
 
  var activityDescriptions = ['Write a research paper with topic: Where does our food come from? And more importantly, why does it travel so far to reach us?', 'Design a product and develop a business plan']; 
    
    // create 2 campaigns
    const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
    for(var i = 0; i<2; i++) {
        const campaign = factory.newResource(NS,'Campaign', 'campaign' + i + '@email.com');
        campaign.firstName = 'Sara';
        campaign.lastName = 'Giammusso';
        campaign.campaignName = campaignNames[i]; 
        campaign.campaignDescription = campaignDescriptions[i];
        campaign.educoinBalance = 0;
        campaign.fundingGoal = 0;
      
        
        for (var j=0; j<1; j++) {
          const missionRegistry = await getAssetRegistry(NS + '.Mission');

          const mission = factory.newResource(NS,'Mission', String(counter));
          
          mission.missionName = missionNames[counter]; 
          mission.missionDescription = missionDescriptions[counter]; 
          mission.bonusEducoin = 2;
          mission.maxStudents = 3;
          mission.mentorFare = 4; 
          mission.currentStudents = 0;
          mission.campaign = campaign; 
          mission.dueDate = new Date(2018, 12, 31, 12, 0, 0, 0);
          counter++; 
          var totalEducoin = 0;
          mission.activities = [];
          for(k=0; k<1; k++){
              var activity = factory.newConcept(NS,'Activity');
              activity.name = "Activity " + k; 
              activity.description = activityDescriptions[act_counter++]; 
              activity.educoin = 3; 
              mission.activities[k] = activity; 
              totalEducoin += activity['educoin']; 
          }
          mission.educoin = totalEducoin; 
          await missionRegistry.add(mission);
        }
        campaign.fundingGoal = 23; 
        campaign.completed = true; 
        campaign.funded = false; 
        await campaignRegistry.addAll([campaign]) ;
    }
 
   

    // create a donor
    const donor = factory.newResource(NS,'Donor', 'donor@email.com');
    donor.firstName ='Donor';
    donor.lastName = 'A';
    const donorAddress = factory.newConcept(NS,'Address');
    donorAddress.city = 'Washington DC';
    donorAddress.country = 'USA';
    donorAddress.street = '1234 Donor Street';
    donorAddress.zip = '20015';
    donor.address = donorAddress; 
    donor.educoinBalance = 100;

    const donorRegistry = await getParticipantRegistry(NS + '.Donor');
    await donorRegistry.addAll([donor]) ;
  
    // create 2 mentors
    const mentor = factory.newResource(NS, 'Mentor','mentor1@email.com');
    mentor.firstName = 'Prof. Joanie';
    mentor.lastName ='Bedore'; 
    mentor.reviews = []; 
    const review1 = factory.newConcept(NS,'Review');
    review1.title = 'Awesome'; 
    review1.description = 'Dr. Bedore hands down is the best mentor I have ever had, she is very kind hearted and pure spirited. Very attentive, caring and understanding'; 
    review1.score = 5; 
    const review2 = factory.newConcept(NS,'Review');
    review2.title = 'Nice mentor'; 
    review2.description = 'Amazing. She is a great mentor and helps you no matter what the situation.'; 
    review2.score = 4; 
    mentor.reviews[0] = review1;
    mentor.reviews[1] = review2; 
    mentor.reviewCount = 2; 
    mentor.reviewSum = 9; 
    mentor.educoinBalance = 0;

    const mentorRegistry = await getParticipantRegistry(NS + '.Mentor');
    await mentorRegistry.addAll([mentor]) ;
  
    const mentor2 = factory.newResource(NS, 'Mentor','mentor2@email.com');
    mentor2.firstName = 'Prof. Andrew';
    mentor2.lastName ='Finn'; 
    mentor2.reviews = []; 
    const review3 = factory.newConcept(NS,'Review');
    review3.title = 'Not that good'; 
    review3.description = 'He is very disorganized, rude and he does not really care about the students. '; 
    review3.score = 2; 
    const review4 = factory.newConcept(NS,'Review');
    review4.title = 'Average'; 
    review4.description = 'Dr. Finn is a good mentor. However, his feedbacks are not that detailed. '; 
    review4.score = 3; 
    mentor2.reviews[0] = review3;
    mentor2.reviews[1] = review4; 
    mentor2.reviewCount = 2;
    mentor2.reviewSum = 5; 
    mentor2.educoinBalance = 0;

    
    await mentorRegistry.addAll([mentor2]) ;


    // create a vendor
    const vendor = factory.newResource(NS, 'Vendor','vendor@email.com');
    vendor.firstName = 'Vendor';
    vendor.lastName ='1'; 
    const vendorAddress = factory.newConcept(NS,'Address');
    vendorAddress.city = 'Washington DC';
    vendorAddress.country = 'USA';
    vendorAddress.street = '1234 Vendor Street';
    vendorAddress.zip = '20015';
    vendor.address = vendorAddress;
    vendor.educoinBalance = 0;

    const vendorRegistry = await getParticipantRegistry(NS + '.Vendor');
    await vendorRegistry.addAll([vendor]) ;
  
    var itemNames = ['The Official Cambridge Guide to IELTS', 'TOPS 1-Subject Notebooks', 'Arteza Highlighters Set of 60, Bulk Pack of Colored Markers'];
    var itemDescriptions = ['Perfect for students at band 4.0 and above, this study guide has EVERYTHING you need to prepare for IELTS', 'Spiral, 8" x 10-1/2", College Rule, Color Assortment May Vary, 70 Sheets, 6 Pack', 'Wide and Narrow Chisel Tips, 6 Assorted Neon Colors, for Adults & Kids'];

    // create an item
    for(var i=0; i<3; i++) {
      const item = factory.newResource(NS, 'Item', String(i)); 
      item.owner = vendor;
      item.name = itemNames[i];
      item.description = itemDescriptions[i];
      item.cost = 3; 

      const itemRegistry = await getAssetRegistry(NS + '.Item');
      await itemRegistry.addAll([item]);
    }

}


/**
 * When a student wants to buy an item from the market place
 * @param {org.bfore.BuyItem} BuyItem - the BuyItem transaction
 * @transaction
 */
async function BuyItem(buyItem){
    const NS = 'org.bfore';
    var currentParticipant = getCurrentParticipant(); 
    if(buyItem.item.owner.getType() != "Vendor")
        throw new Error('Owner is not a vendor'); 
    // 1st check: can the student afford it? 
    if (currentParticipant.educoinBalance >= buyItem.item.cost){
        // the vendor get the money
        buyItem.item.owner.educoinBalance += buyItem.item.cost;
        const vendorRegistry = await getParticipantRegistry(NS + '.Vendor');
        await vendorRegistry.update(buyItem.item.owner);
        // the owner changes
        buyItem.item.owner = currentParticipant;
        const itemRegistry = await getAssetRegistry(NS + '.Item');
        await itemRegistry.update(buyItem.item);
        // the student spent the money 
        currentParticipant.educoinBalance -= buyItem.item.cost; 
        const studentRegistry = await getParticipantRegistry(NS + '.Student');
        await studentRegistry.update(currentParticipant);  
    }
  else
    throw new Error('Not enough money'); 
}

/**
 * When a mentor review student documents
 * @param {org.bfore.MentorReview} MentorReview - the  MentorReview transaction
 * @transaction
 */
async function MentorReview(mentorReview){
  const NS = 'org.bfore';
  if(mentorReview.missionContract.mentorUsed == true)
    throw new Error('Mentor already used'); 
  
  var len = mentorReview.missionContract.attachments.length; 
  for(var i = 0 ; i < mentorReview.attachments.length ; i++ ){
      mentorReview.missionContract.attachments[len] = mentorReview.attachments[i];
      mentorReview.missionContract.filenames[len] = mentorReview.filenames[i]; 
      len++;
   }
  var today = new Date(); 
  mentorReview.missionContract.mentorUsed = true; 
  const missionContractRegistry = await getAssetRegistry(NS + '.MissionContract');
  // Update mission Contract registry 
  await missionContractRegistry.update(mentorReview.missionContract);
  // Update mentor balance
  mentorReview.missionContract.mentor.educoinBalance += mentorReview.missionContract.mission.mentorFare; 
  mentorReview.missionContract.mission.campaign.educoinBalance -= mentorReview.missionContract.mission.mentorFare; 
  const mentorRegistry = await getParticipantRegistry(NS + '.Mentor');
  await mentorRegistry.update(mentorReview.missionContract.mentor); 
  // Update campaign balance
  const campaignRegistry = await getParticipantRegistry(NS + '.Campaign'); 
  await campaignRegistry.update(mentorReview.missionContract.mission.campaign); 
}


/**
 * When a student submit a mission
 * @param {org.bfore.StudentSubmitMission} StudentSubmitMission - the  StudentSubmitMission transaction
 * @transaction
 */
async function StudentSubmitMission(studentSubmitMission){
  const NS = 'org.bfore';
  if(studentSubmitMission.reviewDate == null) {
    const missionContractRegistry = await getAssetRegistry(NS + '.MissionContract');
    var today = new Date();
    var len = studentSubmitMission.missionContract.attachments.length ; 
    studentSubmitMission.missionContract.submissionDate = today; 
    for(var i = 0 ; i < studentSubmitMission.attachments.length ; i++ ){
      studentSubmitMission.missionContract.attachments[len] = studentSubmitMission.attachments[i]; 
      studentSubmitMission.missionContract.filenames[len] = studentSubmitMission.filenames[i]; 
      len++;
    }
    // Update mission Contract registry 
    await missionContractRegistry.update(studentSubmitMission.missionContract);
  }
  else
    throw new Error('Mission already evalued');
}

/**
 * When a student ask for the mentor to review his attachments
 * @param {org.bfore.StudentAskForMentor} StudentAskForMentor - the  StudentAskForMentor transaction
 * @transaction
 */
async function StudentAskForMentor(studentAskForMentor){
  const NS = 'org.bfore';
  if(studentAskForMentor.missionContract.reviewDate == null && studentAskForMentor.missionContract.mentorUsed == false) {
    const missionContractRegistry = await getAssetRegistry(NS + '.MissionContract');
    var today = new Date();
    studentAskForMentor.missionContract.attachments = []; 
    studentAskForMentor.missionContract.filenames = []; 
    studentAskForMentor.missionContract.mentorSubmissionDate = today; 
    for(var i = 0 ; i < studentAskForMentor.attachments.length ; i++ ){
      studentAskForMentor.missionContract.attachments[i] = studentAskForMentor.attachments[i]; 
      studentAskForMentor.missionContract.filenames[i] = studentAskForMentor.filenames[i]; 
    }
    // From this moment this is the mentor for this mission contract 
    studentAskForMentor.missionContract.mentor = studentAskForMentor.mentor; 
 
    // Update mission Contract registry 
    await missionContractRegistry.update(studentAskForMentor.missionContract);
  }
  else
    throw new Error('Mission already evalued or mentor already used');
}

/**
 * When the student leaves a review for the mentor 
 * @param {org.bfore.StudentLeaveReview} StudentLeaveReview - the  StudentLeaveReview transaction
 * @transaction
 */
async function StudentLeaveReview(studentLeaveReview){
  const NS = 'org.bfore';
  const mentorRegistry = await getParticipantRegistry(NS + '.Mentor');
  studentLeaveReview.missionContract.mentor.reviews.push(studentLeaveReview.review); 
  studentLeaveReview.missionContract.mentor.reviewSum += studentLeaveReview.review.score;
  studentLeaveReview.missionContract.mentor.reviewCount++; 
  await mentorRegistry.update(studentLeaveReview.missionContract.mentor); 
}



/**
 * When a student complete a mission
 * @param {org.bfore.StudentCompleteMission} StudentCompleteMission - the  StudentCompleteMission transaction
 * @transaction
 */
async function StudentCompleteMission(studentCompleteMission){
    
    const NS = 'org.bfore';
    if(studentCompleteMission.missionContract.completed == true)
      throw new Error('Mission already completed'); 
  
    /* The goal here is to compute the final earnedEducoin based on the contract and on the result of the mission 
    and to assign this amount to the student */
    var earnedEducoin = 0; 
   

    if(studentCompleteMission.completedActivities.length != studentCompleteMission.missionContract.mission.activities.length)
        throw new Error('Not enough activities specified'); 

    // 1st check: the activity must have been completed in time
    if(studentCompleteMission.missionContract.dueDate.getTime() 
        >= studentCompleteMission.missionContract.submissionDate.getTime()){
       
        // 2nd check: is s/he the winner?
        // 2a: are there already other winners? 
        let result = await query('Q2',
                                    {
                                        mission: `resource:${NS}.Mission#${studentCompleteMission.missionContract.mission}`
                                    });

        // 2b: did s/he completed all the activities?
        var allDone = true; 
        var bonusEducoin = 0; 
        // Now let's also count the earnedEducoin based on the completed activities 
        for(i=0; i< studentCompleteMission.completedActivities.length; i++){
            studentCompleteMission.missionContract.completedActivities[i] = studentCompleteMission.completedActivities[i];
            if (!studentCompleteMission.missionContract.completedActivities[i])
                allDone = false; 
            else
                earnedEducoin += studentCompleteMission.missionContract.mission.activities[i].educoin; 
        }  
                                
        if (result.length == 0 && allDone == true){
            studentCompleteMission.missionContract.winner = true; 
            bonusEducoin = studentCompleteMission.missionContract.mission.bonusEducoin;
        }
    
        studentCompleteMission.missionContract.earnedEducoin = earnedEducoin + bonusEducoin; 
        // so that students cannot complete this mission twice
        studentCompleteMission.missionContract.completed = true; 
        var today = new Date(); 
        studentCompleteMission.missionContract.reviewDate = today; 
        // update MissionContract registry
        const missionContractRegistry = await getAssetRegistry(NS + '.MissionContract');
        await missionContractRegistry.update(studentCompleteMission.missionContract);

        // update Student registry
        studentCompleteMission.missionContract.student.educoinBalance += earnedEducoin; 
        studentCompleteMission.missionContract.student.educoinBalance += bonusEducoin; 
        const studentRegistry = await getParticipantRegistry(NS + '.Student');
        await studentRegistry.update(studentCompleteMission.missionContract.student);

        // update Campaign balance
        studentCompleteMission.missionContract.mission.campaign.educoinBalance -= earnedEducoin;
        studentCompleteMission.missionContract.mission.campaign.educoinBalance -= bonusEducoin;
        const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
        await campaignRegistry.update(studentCompleteMission.missionContract.mission.campaign);
    }
  else
    throw new Error('Due date expired'); 
}


/**
 * Allows to enroll a student to a mission
 * @param {org.bfore.EnrollStudentToMission} enrollStudentToMission - the  EnrollStudentToMission transaction
 * @transaction
 */
async function  EnrollStudentToMission(enrollStudentToMission){
    const NS = 'org.bfore';
    const factory = getFactory();
    var currentParticipant = getCurrentParticipant(); 
    // 1st check: Students can start only the missions whose campaigns
    // are already completed and funded
    // Also there must be still availability for that mission
    if(enrollStudentToMission.mission.campaign.funded == true &&
            enrollStudentToMission.mission.currentStudents < enrollStudentToMission.mission.maxStudents){
        // 2nd check: Students cannot enroll the same mission twice
        let result = await query('Q1',
                                 {student: `resource:${NS}.Student#${currentParticipant.email}`,
                                  mission: `resource:${NS}.Mission#${enrollStudentToMission.mission.missionId}`,
        });
     
        if (result.length == 0){
            const missionContractRegistry = await getAssetRegistry(NS + '.MissionContract');
            let existingAssets = await missionContractRegistry.getAll();
  
            let numberOfAssets = 0;
            await existingAssets .forEach(function (asset) {
                numberOfAssets ++;
            });

            let missionContractId =  String(numberOfAssets +1); 
            const missionContract = factory.newResource(NS,'MissionContract', missionContractId);
            missionContract.dueDate = enrollStudentToMission.mission.dueDate;
            missionContract.mission = enrollStudentToMission.mission;
            missionContract.student = currentParticipant; 
            missionContract.completedActivities = [];
            missionContract.completed = false; 
            // update MissionContract registry
            
            await missionContractRegistry.add(missionContract);

            enrollStudentToMission.mission.currentStudents += 1; 
            // update Mission registry
            const missionRegistry = await getAssetRegistry(NS + '.Mission');
            await missionRegistry.update(enrollStudentToMission.mission);
        }  
        else throw new Error('Student cannot enroll the same mission twice'); 
    }
  else throw new Error('Campaign not available'); 

}



/**
 * Allows to a create a mission and add it to a campaign
 * @param {org.bfore.AddMissionToCampaign} addMissionToCampaign - the  AddMissionToCampaign transaction
 * @transaction
 */
async function  addMissionToCampaign(addMissionToCampaign){
    const NS = 'org.bfore';
    var currentParticipant = getCurrentParticipant();
    // A mission can be added only if the campaign is not already completed
    if (currentParticipant.completed == false){
      // MissionID creation
      const missionRegistry = await getAssetRegistry(NS + '.Mission');
      let existingAssets = await missionRegistry.getAll();
  
      let numberOfAssets = 0;
      await existingAssets .forEach(function (asset) {
       numberOfAssets ++;
      });

      let missionId =  String(numberOfAssets +1);  
        const factory = getFactory();
        const mission = factory.newResource(NS,'Mission', missionId);
        mission.missionName = addMissionToCampaign.missionName;
        mission.missionDescription = addMissionToCampaign.missionDescription;
        mission.bonusEducoin = addMissionToCampaign.bonusEducoin;
        mission.maxStudents = addMissionToCampaign.maxStudents;
        mission.mentorFare = addMissionToCampaign.mentorFare; 
        mission.dueDate = addMissionToCampaign.dueDate; 
        mission.currentStudents = 0;
        mission.activities = []; 
        var totalEducoin = 0;
        for(i=0; i<addMissionToCampaign.activities.length; i++){
            mission.activities[i] = addMissionToCampaign.activities[i];  
            totalEducoin += addMissionToCampaign.activities[i].educoin; 
        }
        mission.educoin = totalEducoin; 
       
        //activity.activityType = addActivityToCampaign.activityType;
        
        
        mission.campaign =  currentParticipant;   
        // MAX Money needed = each mission can be done by a maximum number of students per mission, and the winner also earn a bonus
        currentParticipant.fundingGoal += mission.educoin * mission.maxStudents;
        currentParticipant.fundingGoal += mission.bonusEducoin; 
        currentParticipant.fundingGoal += mission.mentorFare * mission.maxStudents; 
        // This may be the last mission for that campaign...
        if (addMissionToCampaign.completeCampaign == true){
            currentParticipant.completed = true;
        } 

        // update Mission registry
        
        await missionRegistry.add(mission);
        // update Campaign registry
        const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
        await campaignRegistry.update(currentParticipant); 
    } 
    else throw new Error('Campaign already completed'); 
}



/**
 * Allows to a donor to fund a chosen campaign
 * @param {org.bfore.FundCampaign} fundCampaign - the FundCampaign transaction
 * @transaction
 */
async function fundCampaign(fundCampaign){
    const NS = 'org.bfore';
    var currentParticipant = getCurrentParticipant(); 
    // Check if the campaign can be funded
    // Campaign can be funded if it hasn't reach the funding goal yet and if it is complete
    // i.e. all the missions have been added.
    if (fundCampaign.campaign.funded == false && fundCampaign.campaign.completed == true && fundCampaign.educoinAmount > 0){
        if (fundCampaign.educoinAmount > fundCampaign.campaign.fundingGoal - fundCampaign.campaign.educoinBalance )
            amount = fundCampaign.campaign.fundingGoal - fundCampaign.campaign.educoinBalance;
        else 
            amount = fundCampaign.educoinAmount;
        fundCampaign.realAmount = amount; 
       
        //Check if the donor has enough money
        if (currentParticipant.educoinBalance < amount){
           throw new Error('Not enough money'); 
        }
        
        //Check if now the campaign is totally funded
        if (fundCampaign.campaign.educoinBalance + amount  == fundCampaign.campaign.fundingGoal){
            fundCampaign.campaign.funded = true; 
        }
      
       
        fundCampaign.campaign.educoinBalance += amount;
        currentParticipant.educoinBalance -= amount;

        // update Campaign registry
        const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
        await campaignRegistry.update(fundCampaign.campaign);
        // update Donor 
        const donorRegistry = await getParticipantRegistry(NS + '.Donor');
        await donorRegistry.update(currentParticipant);
    }
  else throw new Error('Error'); 
    
}

/**
 * Allows to a vendor to create a new item
 * @param {org.bfore.AddItem} addItem - the AddItem transaction
 * @transaction
 */
async function addItem(addItem){
      const NS = 'org.bfore';
      var currentParticipant = getCurrentParticipant(); 
      const factory = getFactory();
  
      // ItemID creation
      const itemRegistry = await getAssetRegistry(NS + '.Item');
      let existingAssets = await itemRegistry.getAll();
  
      let numberOfAssets = 0;
      await existingAssets .forEach(function (asset) {
       numberOfAssets ++;
      });

      let itemId =  String(numberOfAssets +1);  
 
      const item = factory.newResource(NS,'Item', itemId);
      item.name = addItem.name; 
      item.description = addItem.description;
      item.cost = addItem.cost; 
      item.owner = currentParticipant; 
  
      // update Item registry
      
      await itemRegistry.add(item);
      
}