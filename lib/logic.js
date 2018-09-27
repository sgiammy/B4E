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
    const student = factory.newResource(NS, 'Student','student@email.com');
    student.name = 'Student A';
    const studentAddress = factory.newConcept(NS,'Address');
    studentAddress.city = 'Washington DC';
    studentAddress.country = 'USA';
    studentAddress.street = '3222 Northampton Street';
    studentAddress.zip = '20015';
    student.address = studentAddress; 
    student.educoinBalance = 0;

    student.campaigns = [];
    student.activities = []; 

    const studentRegistry = await getParticipantRegistry(NS + '.Student');
    await studentRegistry.addAll([student]) ;

    // create a campaign
    const campaign = factory.newResource(NS,'Campaign', 'campaign@email.com');
    campaign.name = 'Campaign A';
    const campaignAddress = factory.newConcept(NS,'Address');
    campaignAddress.city = 'Washington DC';
    campaignAddress.country = 'USA';
    campaignAddress.street = '6817 Campaign Street';
    campaignAddress.zip = '20015';
    campaign.address = campaignAddress; 
    campaign.educoinBalance = 0;
    campaign.students = [];
    campaign.activities = [];

    const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
    await campaignRegistry.addAll([campaign]) ;

    // create a donor
    const donor = factory.newResource(NS,'Donor', 'donor@email.com');
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

    const activityContract = factory.newResource(NS,'ActivityContract', enrollStudentToActivity.activityContractId);
    activityContract.dueDate = enrollStudentToActivity.dueDate;
    activityContract.educoin = enrollStudentToActivity.educoin;
    activityContract.bonusEducoin = enrollStudentToActivity.bonusEducoin;
    activityContract.activity = enrollStudentToActivity.activity;
    activityContract.student = enrollStudentToActivity.student;
   
    // update ActivityContract registry
    const activityContractRegistry = await getAssetRegistry(NS + '.ActivityContract');
    await activityContractRegistry.add(activityContract);

    enrollStudentToActivity.student.activities.push(enrollStudentToActivity.activity);
    // update Student registry
    const studentRegistry = await getParticipantRegistry(NS + '.Student');
    await studentRegistry.update(enrollStudentToActivity.student);
    
}



/**
 * Allows to a create an activity and add it to a campaign
 * @param {org.bfore.AddActivityToCampaign} addActivityToCampaign - the  AddActivityToCampaign transaction
 * @transaction
 */
async function  addActivityToCampaign(addActivityToCampaign){
    const NS = 'org.bfore';
    const factory = getFactory();
    const activity = factory.newResource(NS,'Activity', addActivityToCampaign.activityId);
    activity.activityName = addActivityToCampaign.activityName;
    activity.activityType = addActivityToCampaign.activityType;
    activity.campaign = addActivityToCampaign.campaign; 
    // update Activity registry
    const activityRegistry = await getAssetRegistry(NS + '.Activity');
    await activityRegistry.add(activity);

    addActivityToCampaign.campaign.activities.push(activity);
    // update Campaign registry
    const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
    await campaignRegistry.update(addActivityToCampaign.campaign);
    
}


/**
 * Allows to a student to enroll a given campaign
 * @param {org.bfore.EnrollStudentToCampaign} enrollStudentToCampaign - the  EnrollStudentToCampaign transaction
 * @transaction
 */
async function  enrollStudentToCampaign(enrollStudentToCampaign){
    const NS = 'org.bfore';
    
    enrollStudentToCampaign.campaign.students.push(enrollStudentToCampaign.student);
    enrollStudentToCampaign.student.campaigns.push(enrollStudentToCampaign.campaign);
    // update Campaign registry
    const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
    await campaignRegistry.update(enrollStudentToCampaign.campaign);
    // update Student registry
    const studentRegistry = await getParticipantRegistry(NS + '.Student');
    await studentRegistry.update(enrollStudentToCampaign.student);
}

/**
 * Allows to a donor to fund a chosen campaign
 * @param {org.bfore.FundCampaign} fundCampaign - the FundCampaign transaction
 * @transaction
 */
async function fundCampaign(fundCampaign){
    const NS = 'org.bfore';
 
    fundCampaign.campaign.educoinBalance += fundCampaign.educoinAmount;
    fundCampaign.donor.educoinBalance -= fundCampaign.educoinAmount;
    // update Campaign registry
    const campaignRegistry = await getParticipantRegistry(NS + '.Campaign');
    await campaignRegistry.update(fundCampaign.campaign);
    // update Donor 
    const donorRegistry = await getParticipantRegistry(NS + '.Donor');
    await donorRegistry.update(fundCampaign.donor);
}