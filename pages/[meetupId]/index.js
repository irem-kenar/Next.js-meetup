import { Fragment } from "react";
import Head from 'next/head';
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name='description' content={props.meetupData.description}></meta>
            </Head>
            <MeetupDetail
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            // image="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg"
            // title="First Meetup"
            // address="Some Street 5, Some City"
            // description="Meetup description" 
            />
        </Fragment>
    )
}

export async function getStaticPaths() {

    const client = await MongoClient.connect('mongodb+srv://bUG9e78ulpLnX9OP:bUG9e78ulpLnX9OP@cluster0.ojaqa.mongodb.net/meetups?retryWrites=true&w=majority');

    const db = client.db();
    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

    client.close();

    return {
        fallback: 'blocking',
        //generating paths dynamically
        paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } }))
        // [
        //     {
        //         params: {
        //             meetupId: 'm1'
        //         }
        //     },
        //     {
        //         params: {
        //             meetupId: 'm2'
        //         }
        //     }
        // ]
    }
}

export async function getStaticProps(context) {
    // fetch data for a single meetup
    const meetupId = context.params.meetupId;
    // fetch a single meetup dynamically
    const client = await MongoClient.connect('mongodb+srv://bUG9e78ulpLnX9OP:bUG9e78ulpLnX9OP@cluster0.ojaqa.mongodb.net/meetups?retryWrites=true&w=majority');

    const db = client.db();
    const meetupsCollection = db.collection('meetups');

    const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

    client.close();

    return {
        props: {
            //dynamically and need to convert _id back to string not to get an error
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description
            }
            //dynamically 
            //meetupData: selectedMeetup
            //Hardcoded
            // {
            //     image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
            //     id: meetupId,
            //     title: 'First Meetup',
            //     address: 'Some Street 5, Some City',
            //     description: 'Meetup description'
            // },
        },
    }
}

export default MeetupDetails;