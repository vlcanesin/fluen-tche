import { useState, useEffect } from "react";
import { generateDBHandle, fetchDBUser, updateDBUserData, UserData } from "../../firebase/firestore/user";
import { updateDBQuestionnaire } from '../../firebase/firestore/questionnaire';

const useLikeDislike = (currentUser, questUrl) => {
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    const [fetchedUser, setFetchedUser] = useState(null);

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (currentUser) {
                const userHandle = generateDBHandle(currentUser);
                const dbUser = await fetchDBUser(userHandle);
                setFetchedUser(dbUser);

                const historyItem = dbUser?.data.history.find(h => h.url === questUrl);

                if (historyItem) {
                    setHasLiked(historyItem.has_liked);
                    setHasDisliked(historyItem.has_disliked);
                }
            }
        };

        fetchUserHistory();
    }, [currentUser, questUrl]);

    const updateLikeDislike = async (newHasLiked, newHasDisliked, data) => {
        if (fetchedUser) {
            // Update questionnaire meta data
            if (newHasLiked !== hasLiked) {
                data.meta.n_likes += newHasLiked ? 1 : -1;
            }
            if (newHasDisliked !== hasDisliked) {
                data.meta.n_dislikes += newHasDisliked ? 1 : -1;
            }

            // Update user history
            const historyIndex = fetchedUser.data.history.findIndex(h => h.url === questUrl);
            if (historyIndex !== -1) {
                fetchedUser.data.history[historyIndex].has_liked = newHasLiked;
                fetchedUser.data.history[historyIndex].has_disliked = newHasDisliked;
            } else {
                fetchedUser.data.history.push({ url: questUrl, has_liked: newHasLiked, has_disliked: newHasDisliked });
            }

            // Save the updates to Firestore
            await updateDBQuestionnaire(questUrl, data);
            await updateDBUserData(currentUser, new UserData(fetchedUser.data));

            setHasLiked(newHasLiked);
            setHasDisliked(newHasDisliked);
        }
    };

    const handleLike = (data) => {
        const newHasLiked = !hasLiked;
        const newHasDisliked = hasDisliked && newHasLiked ? false : hasDisliked;
        updateLikeDislike(newHasLiked, newHasDisliked, data);
    };

    const handleDislike = (data) => {
        const newHasDisliked = !hasDisliked;
        const newHasLiked = hasLiked && newHasDisliked ? false : hasLiked;
        updateLikeDislike(newHasLiked, newHasDisliked, data);
    };

    return {
        hasLiked,
        hasDisliked,
        handleLike,
        handleDislike,
    };
};

export default useLikeDislike;
