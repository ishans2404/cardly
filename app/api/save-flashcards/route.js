import { NextResponse } from 'next/server';
import { db } from '../../../firebase';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export async function POST(req) {
    const { userId, setName, flashcards } = await req.json();

    try {
        const userDocRef = doc(db, 'users', userId);
        const setDocRef = doc(userDocRef, 'flashcardSets', setName);

        await setDoc(setDocRef, { flashcards });

        await updateDoc(userDocRef, {
            flashcardSets: arrayUnion(setName)
        });

        return NextResponse.json({ message: 'Flashcards saved successfully' });
    } catch (error) {
        console.error('Error saving flashcards:', error);
        return NextResponse.json({ error: 'Failed to save flashcards' }, { status: 500 });
    }
}
