import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskDialogComponent } from '../dialogs/task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BoardService } from '../board.service';
import { Board, Task } from '../board.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  @Input() board: any;

  constructor(private boardService: BoardService, private dialog: MatDialog) { }

  taskDrop(event: CdkDragDrop<Board>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data.tasks as Task[], event.previousIndex, event.currentIndex);
      this.boardService.updateTasks(this.board.id, this.board.tasks);
    } else {
      transferArrayItem(
        event.previousContainer.data.tasks as Task[],
        event.container.data.tasks as Task[],
        event.previousIndex,
        event.currentIndex,
      );
      this.boardService.updateTasks(this.board.id, this.board.tasks);
      this.boardService.updateTasks(
        event.previousContainer.data.id as string,
        event.previousContainer.data.tasks as Task[]
      );
    }
  }

  openDialog(task?: Task, idx?: number): void {
    const newTask = { label: 'purple' };
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task
        ? { task: { ...task }, isNew: false, boardId: this.board.id, idx }
        : { task: newTask, isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.isNew) {
          this.boardService.updateTasks(this.board.id, [
            ...this.board.tasks,
            result.task
          ]);
        } else {
          const update = this.board.tasks;
          update.splice(result.idx, 1, result.task);
          this.boardService.updateTasks(this.board.id, this.board.tasks);
        }
      }
    });
  }

  handleDelete() {
    this.boardService.deleteBoard(this.board.id);
  }
}
