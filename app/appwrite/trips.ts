import {appwriteConfig, tablesDB} from "~/appwrite/client";
import {Query} from "appwrite";
import {storeUserData} from "~/appwrite/auth";


export const getAllTrips = async (limit: number, offset: number) => {
    try {
        const { rows: allTrips, total } = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.tripTableId,
            queries: [
                Query.limit(limit), Query.offset(offset), Query.orderDesc('createdAt')
            ]
        })

        if(total === 0) {
            console.error('no trips found')
            return { allTrips: [], total };
        }

        return { allTrips, total };
    } catch (e) {
        console.log('Error fetching trips', e)
        return { allTrips: [], total: 0 }
    }
}


export const getTripById = async (tripId: string) => {
    try {
        const trip = await tablesDB.getRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.tripTableId,
            rowId: tripId
        })
        if(!trip.$id) {
            console.log("Trip not found")
            return null
        }
        return trip
    } catch (error) {
        console.error("Error fetching trip", error);
        return null;
    }
};

