import {account, appwriteConfig, tablesDB,} from "~/appwrite/client";
import {ID, OAuthProvider, Query} from "appwrite";
import {redirect} from "react-router";


export const getExistingUser = async (id: string) => {
    try {
        const { rows, total } = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            queries: [
                Query.equal('accountId', id),
            ],
        })
        return total > 0 ? rows[0] : null
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

export const getUserFromRowId = async (id: string) => {
    try {
        const fetched_user = await tablesDB.getRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            rowId: id
        })
        return fetched_user ? fetched_user : storeUserData()
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};


export const storeUserData = async () => {
    try {
        const user = await account.get();
        if (!user) throw new Error("User not found")

        const { providerAccessToken } = (await account.getSession({
            sessionId: "current"
        })) || {};
        const profilePicture = providerAccessToken
            ? await getGooglePicture(providerAccessToken)
            : null;

        const rowData = {
            accountId: user.$id,
            email: user.email,
            name: user.name,
            imageUrl: profilePicture,
            joinedAt: new Date().toISOString(),
        }

        const createdUser = await tablesDB.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            rowId: ID.unique(), // Use ID.unique() to generate a unique ID
            data: rowData,
        });

        if (!createdUser.$id) redirect("/sign-in");
        return createdUser
    } catch (error) {
        console.error("Error storing user data:", error);
    }
};


const getGooglePicture = async (accessToken: string) => {
    try {
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch Google profile picture");

        const { photos } = await response.json();
        return photos?.[0]?.url || null;
    } catch (error) {
        console.error("Error fetching Google picture:", error);
        return null;
    }
};


export const loginWithGoogle = async () => {
    try{
        account.createOAuth2Session({
            provider: OAuthProvider.Google,
            success: 'https://localhost:5173'
        })

    } catch (e) {
        console.error("Error during OAuth2 session creation:", e);

    }
}


export const logoutUser = async () => {
    try {
        await account.deleteSession({
            sessionId:"current"
        });
    } catch (error) {
        console.error("Error during logout:", error);
    }
};


export const getUser = async () => {
    try{
        const user = await account.get()
        if(!user) return redirect('/sign-in')

        const {rows} = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            queries: [
                Query.equal('accountId', user.$id),
            ],
        })
        console.log("row is", rows)
        return rows.length > 0 ? rows[0] : await storeUserData();
    } catch (e) {
        console.log(e)
    }
}


export const getAllUsers = async (limit: number, offset: number) => {
    try {
        const { rows: users, total } = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            queries: [
                Query.limit(limit), Query.offset(offset)
        ]
    })

        if(total === 0) return { users: [], total };

        return { users, total };
    } catch (e) {
        console.log('Error fetching users')
        return { users: [], total: 0 }
    }
}