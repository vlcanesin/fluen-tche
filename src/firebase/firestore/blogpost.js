import { collection, addDoc, getDocs, doc, updateDoc, query, where, Timestamp } from "firebase/firestore"; 
import { db } from "../firebase";
import { v4 as uuidv4 } from 'uuid';
import languageEnum from "./enums";

// Estrutura pode mudar
class BlogPostData {
    constructor(name, language, md_string, meta) {
        this.name = name || "";
        this.language = language || 1;
        this.md_string = md_string || "";
        this.meta = meta || {
            author: "",
            date: Timestamp.fromDate(new Date()),
            n_likes: 0,
            n_dislikes: 0,
            tags: [],
            visible: false,
            url: ""
        };
    }

    // Method to set metadata
    setMeta(author, date, n_likes, n_dislikes, tags, visible, url) {
        this.meta = {
            author: author || "",
            date: Timestamp.fromDate(new Date(date)) || Timestamp.fromDate(new Date()),
            n_likes: n_likes || 0,
            n_dislikes: n_dislikes || 0,
            tags: tags || [],
            visible: visible || false,
            url: url || ""
        };
    }

    // Method to convert class instance to JSON
    toJSON() {
        return {
            name: this.name,
            language: this.language,
            md_string: this.md_string,
            meta: this.meta
        };
    }
}

async function createDefaultDBBlogPost() {
    const reference = collection(db, "blogposts");
    const uniqueUrl = uuidv4();
    const newBlogPost = new BlogPostData(
        "", 1, "",
        {
            author: "",
            date: "",
            n_likes: 0,
            n_dislikes: 0,
            tags: [],
            visible: false,
            url: uniqueUrl
        }
    );

    try {
        await addDoc(reference, newBlogPost.toJSON());
        console.log("Blog Post added to Firestore:", uniqueUrl);
        return uniqueUrl;
    } catch (error) {
        console.error("Error adding blog post to Firestore:", error);
    }
}

async function updateDBBlogPost(url, blogPostData) {
    const dbBlogPost = await fetchDBBlogPost(url);

    console.log("in updateBP");
    if(!dbBlogPost) {
        throw new Error('URL de blog post invalida');
    } else {
        try {
            const bpRef = doc(db, "blogposts", dbBlogPost.id);
            await updateDoc(bpRef, blogPostData.toJSON());
            console.log("blogpost data updated:", url);
        } catch (error) {
            console.error("Error updating blogpost data:", error);
        }
    }
}

async function fetchDBBlogPost(url) {
    const reference = collection(db, "blogposts");
    const q = query(reference, where("meta.url", "==", url));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        } else {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, data: doc.data() };
        }
    } catch (error) {
        console.error("Error fetching blog post:", error);
    }
}

export { BlogPostData, createDefaultDBBlogPost, updateDBBlogPost, fetchDBBlogPost }