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

    // create a campaign
    const campaign = factory.newResource(NS,'Campaign', 'campaign@email.com');
    campaign.firstName = 'Campaign';
    campaign.lastName = 'A'; 
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

    // create a vendor
    const vendor = factory.newResource(NS, 'Vendor','vendor@email.com');
    vendor.firstName = 'Vendor';
    vendor.lastName ='A'; 
    const vendorAddress = factory.newConcept(NS,'Address');
    vendorAddress.city = 'Washington DC';
    vendorAddress.country = 'USA';
    vendorAddress.street = '1234 Vendor Street';
    vendorAddress.zip = '20015';
    vendor.address = vendorAddress;
    vendor.educoinBalance = 0;

    const vendorRegistry = await getParticipantRegistry(NS + '.Vendor');
    await vendorRegistry.addAll([vendor]) ;

    // create an item
    const item = factory.newResource(NS, 'Item', 'ItemA'); 
    item.owner = vendor;
    item.name = 'Item A';
    item.description = 'Description Item A'; 
    item.cost = 3; 

    const itemRegistry = await getAssetRegistry(NS + '.Item');
    await itemRegistry.addAll([item]);

}

/**
 * When a student wants to buy an item from the market place
 * @param {org.bfore.BuyItem} BuyItem - the BuyItem transaction
 * @transaction
 */
async function BuyItem(buyItem){
    const NS = 'org.bfore';
    var currentParticipant = getCurrentParticipant(); 
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
    var earnedEducoin = 0; 

    if(studentCompleteActivity.completedAssignments.length != studentCompleteActivity.activityContract.activity.assignments.length)
        return; 

    // 1rst check: the activity must have been completed in time
    if(studentCompleteActivity.activityContract.dueDate.getTime() 
        >= studentCompleteActivity.today.getTime()){
       
        // 2nd check: is s/he the winner?
        // 2a: are there already other winners? 
        let result = await query('Q2',
                                    {
                                        activity: `resource:${NS}.Activity#${studentCompleteActivity.activityContract.activity}`
                                    });

        // 2b: did s/he completed all the assignments?
        var allDone = true; 
        var bonusEducoin = 0; 
        // Now let's also count the earnedEducoin based on the completed assignments 
        for(i=0; i< studentCompleteActivity.completedAssignments.length; i++){
            studentCompleteActivity.activityContract.completedAssignments[i] = studentCompleteActivity.completedAssignments[i];
            if (!studentCompleteActivity.activityContract.completedAssignments[i])
                allDone = false; 
            else
                earnedEducoin += studentCompleteActivity.activityContract.activity.assignments[i].educoin; 
        }  
                                
        if (result.length == 0 && allDone == true){
            studentCompleteActivity.activityContract.winner = true; 
            bonusEducoin = studentCompleteActivity.activityContract.activity.bonusEducoin;
        }
    
        studentCompleteActivity.activityContract.earnedEducoin = earnedEducoin + bonusEducoin; 
        
        // update ActivityContract registry
        const activityContractRegistry = await getAssetRegistry(NS + '.ActivityContract');
        await activityContractRegistry.update(studentCompleteActivity.activityContract);

        // update Student registry
        studentCompleteActivity.activityContract.student.educoinBalance += earnedEducoin; 
        studentCompleteActivity.activityContract.student.educoinBalance += bonusEducoin; 
        const studentRegistry = await getParticipantRegistry(NS + '.Student');
        await studentRegistry.update(studentCompleteActivity.activityContract.student);

        // update Campaign balance
        studentCompleteActivity.activityContract.activity.campaign.educoinBalance -= earnedEducoin;
        studentCompleteActivity.activityContract.activity.campaign.educoinBalance -= bonusEducoin;
        const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
        await campaignRegistry.update(studentCompleteActivity.activityContract.activity.campaign);
    }
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
            activityContract.completedAssignments = [];
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
        activity.bonusEducoin = addActivityToCampaign.bonusEducoin;
        activity.maxStudents = addActivityToCampaign.maxStudents;
        activity.currentStudents = 0;
        activity.assignments = []; 
        var totalEducoin = 0;
        for(i=0; i<addActivityToCampaign.assignments.length; i++){
            activity.assignments[i] = addActivityToCampaign.assignments[i];  
            totalEducoin += addActivityToCampaign.assignments[i].educoin; 
        }
        activity.educoin = totalEducoin; 
        
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
    var currentParticipant = getCurrentParticipant(); 
    // Check if the campaign can be funded
    // Campaign can be funded if it hasn't reach the funding goal yet and if it is complete
    // i.e. all the activities have been added.
    if (fundCampaign.campaign.funded == false && fundCampaign.campaign.completed == true && fundCampaign.educoinAmount > 0){
        if (fundCampaign.educoinAmount > fundCampaign.campaign.fundingGoal - fundCampaign.campaign.educoinBalance )
            amount = fundCampaign.campaign.fundingGoal - fundCampaign.campaign.educoinBalance;
        else 
            amount = fundCampaign.educoinAmount;

        //Check if the donor has enough money
        if (currentParticipant.earnedEducoin < amount){
            return; 
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
    
}