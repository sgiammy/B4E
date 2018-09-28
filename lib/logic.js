/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.bfore.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo){
    const factory = getFactory();
    const NS = 'org.bfore';

    // create a student
    const student = factory.newResource(NS, 'Student','StudentA');
    student.email = 'studentA@email.com'
    student.name = 'Student A';
    const studentAddress = factory.newConcept(NS,'Address');
    studentAddress.city = 'Washington DC';
    studentAddress.country = 'USA';
    studentAddress.street = '3222 Northampton Street';
    studentAddress.zip = '20015';
    student.address = studentAddress; 
    student.educoinBalance = 0;

    const studentRegistry = await getParticipantRegistry(NS + '.Student');
    await studentRegistry.addAll([student]) ;

    // create a campaign
    const campaign = factory.newResource(NS,'Campaign', 'CampaignA');
    campaign.name = 'Campaign A';
    campaign.email ='campaign@email.com';
    const campaignAddress = factory.newConcept(NS,'Address');
    campaignAddress.city = 'Washington DC';
    campaignAddress.country = 'USA';
    campaignAddress.street = '6817 Campaign Street';
    campaignAddress.zip = '20015';
    campaign.address = campaignAddress; 
    campaign.educoinBalance = 0;
    campaign.fundingGoal = 0;
    campaign.completed = false; 
    campaign.funded = false; 


    const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
    await campaignRegistry.addAll([campaign]) ;

    // create a donor
    const donor = factory.newResource(NS,'Donor', 'DonorA');
    donor.email = 'donor@email.com';
    donor.name = 'Donor A';
    const donorAddress = factory.newConcept(NS,'Address');
    donorAddress.city = 'Washington DC';
    donorAddress.country = 'USA';
    donorAddress.street = '1234 Donor Street';
    donorAddress.zip = '20015';
    donor.address = donorAddress; 
    donor.educoinBalance = 10;

    const donorRegistry = await getParticipantRegistry(NS + '.Donor');
    await donorRegistry.addAll([donor]) ;


}

/**
 * When a student complete an activity
 * @param {org.bfore.StudentCompleteActivity} StudentCompleteActivity - the  StudentCompleteActivity transaction
 * @transaction
 */
async function StudentCompleteActivity(studentCompleteActivity){
    const NS = 'org.bfore';
  
    /* The goal here is to compute the final earnedEducoin based on the contract and on the result of the activity 
    and to assign this amount to the student */

   
    // 1rst check: the activity must have been completed in time
    if(studentCompleteActivity.activityContract.dueDate.getTime() >=studentCompleteActivity.today.getTime())
        earnedEducoin = studentCompleteActivity.activityContract.educoin; 
    else
        earnedEducoin = 0; 

    studentCompleteActivity.activityContract.earnedEducoin = earnedEducoin; 
    
    // update ActivityContract registry
    const activityContractRegistry = await getAssetRegistry(NS + '.ActivityContract');
    await activityContractRegistry.update(studentCompleteActivity.activityContract);

     // update Student registry
    studentCompleteActivity.activityContract.student.educoinBalance += earnedEducoin; 
    const studentRegistry = await getParticipantRegistry(NS + '.Student');
    await studentRegistry.update(studentCompleteActivity.activityContract.student);

    // update Campaign balance
    studentCompleteActivity.activityContract.activity.campaign.educoinBalance -= earnedEducoin;
    const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
    await campaignRegistry.update(studentCompleteActivity.activityContract.activity.campaign);
    
}


/**
 * Allows to enroll a student to an activity
 * @param {org.bfore.EnrollStudentToActivity} enrollStudentToActivity - the  EnrollStudentToActivity transaction
 * @transaction
 */
async function  EnrollStudentToActivity(enrollStudentToActivity){
    const NS = 'org.bfore';
    const factory = getFactory();
    var currentParticipant = getCurrentParticipant(); 
    // 1st check: Students can start only the activities whose campaigns
    // are already completed and funded
    // Also there must be still availability for that activity
    if(enrollStudentToActivity.activity.campaign.funded == true &&
            enrollStudentToActivity.activity.currentStudents < enrollStudentToActivity.activity.maxStudents){
        // 2nd check: Students cannot enroll the same activity twice
        let result = await query('Q1',
                                 {student: `resource:${NS}.Student#${currentParticipant.participantId}`,
                                  activity: `resource:${NS}.Activity#${enrollStudentToActivity.activity.activityId}`,
        });

        if (result.length == 0){
            const activityContract = factory.newResource(NS,'ActivityContract', enrollStudentToActivity.activityContractId);
            activityContract.dueDate = enrollStudentToActivity.dueDate;
            activityContract.activity = enrollStudentToActivity.activity;
            activityContract.student = currentParticipant; 
            // update ActivityContract registry
            const activityContractRegistry = await getAssetRegistry(NS + '.ActivityContract');
            await activityContractRegistry.add(activityContract);

            enrollStudentToActivity.activity.currentStudents += 1; 
            // update Activity registry
            const activityRegistry = await getAssetRegistry(NS + '.Activity');
            await activityRegistry.update(enrollStudentToActivity.activity);
        }
    }

}



/**
 * Allows to a create an activity and add it to a campaign
 * @param {org.bfore.AddActivityToCampaign} addActivityToCampaign - the  AddActivityToCampaign transaction
 * @transaction
 */
async function  addActivityToCampaign(addActivityToCampaign){
    const NS = 'org.bfore';
    var currentParticipant = getCurrentParticipant();
    // An activity can be added only if the campaign is not already completed
    if (currentParticipant.completed == false){
        const factory = getFactory();
        const activity = factory.newResource(NS,'Activity', addActivityToCampaign.activityId);
        activity.activityName = addActivityToCampaign.activityName;
        activity.educoin = addActivityToCampaign.educoin; 
        activity.bonusEducoin = addActivityToCampaign.bonusEducoin;
        activity.maxStudents = addActivityToCampaign.maxStudents;
        activity.currentStudents = 0;
        
        if (addActivityToCampaign.description != null)
            activity.description = addActivityToCampaign.description;

        activity.activityType = addActivityToCampaign.activityType;
        
        
        activity.campaign =  currentParticipant;   
        // MAX Money needed = each activity can be done by a maximum number of students per activity, and the winner also earn a bonus
        currentParticipant.fundingGoal += activity.educoin * activity.maxStudents;
        currentParticipant.fundingGoal += activity.bonusEducoin; 
        // This may be the last activity for that campaign...
        if (addActivityToCampaign.completeCampaign == true){
            currentParticipant.completed = true;
        } 

        // update Activity registry
        const activityRegistry = await getAssetRegistry(NS + '.Activity');
        await activityRegistry.add(activity);
        // update Campaign registry
        const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
        await campaignRegistry.update(currentParticipant); 
    } 
}



/**
 * Allows to a donor to fund a chosen campaign
 * @param {org.bfore.FundCampaign} fundCampaign - the FundCampaign transaction
 * @transaction
 */
async function fundCampaign(fundCampaign){
    const NS = 'org.bfore';
    // Check if the campaign can be funded
    // Campaign can be funded if it hasn't reach the funding goal yet and if it is complete
    // i.e. all the activities have been added.
    if (fundCampaign.campaign.funded == false && fundCampaign.campaign.completed == true && fundCampaign.educoinAmount > 0){
        if (fundCampaign.educoinAmount > fundCampaign.campaign.fundingGoal - fundCampaign.campaign.educoinBalance )
            amount = fundCampaign.campaign.fundingGoal - fundCampaign.campaign.educoinBalance;
        else 
            amount = fundCampaign.educoinAmount;
        
        //Check if now the campaign is totally funded
        if (fundCampaign.campaign.educoinBalance + amount  == fundCampaign.campaign.fundingGoal){
            fundCampaign.campaign.funded = true; 
        }

        fundCampaign.campaign.educoinBalance += amount;
        var currentParticipant = getCurrentParticipant(); 
        currentParticipant.educoinBalance -= amount;

        // update Campaign registry
        const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
        await campaignRegistry.update(fundCampaign.campaign);
        // update Donor 
        const donorRegistry = await getParticipantRegistry(NS + '.Donor');
        await donorRegistry.update(currentParticipant);
    }
    
}