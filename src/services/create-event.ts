import * as mongo from 'mongodb';
import { publishServerEvent } from './stream';

export async function publishFollowingChanged(userId: mongo.ObjectID) {
	await publishServerEvent(userId, 'followingChanged');
}

export async function publishMutingChanged(userId: mongo.ObjectID) {
	await publishServerEvent(userId, 'mutingChanged');
}

export async function publishFilterChanged(userId: mongo.ObjectID) {
	await publishServerEvent(userId, 'filterChanged');
}

export async function publishTerminate(userId: mongo.ObjectID) {
	await publishServerEvent(userId, 'terminate');
}
