import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  addDoc,
  deleteDoc,
  collection,
  Firestore,
  doc,
  updateDoc,
  arrayRemove,
  collectionData,
  query,
  where,
  orderBy,
  writeBatch,
  DocumentReference
} from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { Board, Task } from './board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private afa: Auth, private db: Firestore) { }

  /**
   * Creates a new board for the current user
   */
  async createBoard(data: Board) {
    const user = this.afa.currentUser;
    if (user) {
      return addDoc(
        collection(this.db, 'boards'),
        {
          ...data,
          uid: user.uid,
          tasks: [{ description: 'Hello!', label: 'yellow' }]
        });
    }
    return;
  }

  /**
   * Delete board
   */
  deleteBoard(boardId: string) {
    return deleteDoc(
      doc(this.db, 'boards', boardId)
    );
  }

  /**
   * Updates the tasks on board
   */
  updateTasks(boardId: string, tasks: Task[]) {
    return updateDoc(
      doc(this.db, 'boards', boardId),
      { tasks }
    );
  }

  /**
   * Remove a specifc task from the board
   */
  removeTask(boardId: string, task: Task) {
    return updateDoc(
      doc(this.db, 'boards', boardId),
      { tasks: arrayRemove(task) }
    );
  }

  /**
   * Get all boards owned by current user
   */
  getUserBoards() {
    return authState(this.afa).pipe(
      switchMap(user => {
        if (user) {
          return collectionData(
            query(
              collection(this.db, 'boards'),
              where('uid', '==', user.uid),
              orderBy('priority')
            ),
            { idField: 'id' }
          );
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Run a batch write to change the priority of each board for sorting
   */
  sortBoards(boards: Board[]) {
    const batch = writeBatch(this.db);
    const refs = boards.map(b => doc(this.db, 'boards', b.id as string) as DocumentReference);
    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }
}