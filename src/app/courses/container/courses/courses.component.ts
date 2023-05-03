import { ConfirmationDialogComponent } from './../../components/confirmation-dialog/confirmation-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { Course } from 'src/model/course';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]> | null = null;

  displayedColumns = ['name','category', 'actions'];


  constructor( private courseService:CoursesService,
    public dialog: MatDialog, private router:Router,
    private route:ActivatedRoute,
    private snackBar: MatSnackBar) {
    this.refresh();
  }

  refresh(){
    this.courses$ = this.courseService.list()
   .pipe(
    catchError(error =>{
      this.onError('Erro ao carregar cursos.')
      return of([])
    })
   );
  }


  ngOnInit(): void {
  }

  onError(errorMsg:string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  onAdd(){
    this.router.navigate(['new'], {relativeTo:this.route});
  }

  onEdit(course:Course){
    this.router.navigate(['edit',course._id], {relativeTo:this.route});
  }

  onRemove(course:Course){

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse curso?',
    });

    dialogRef.afterClosed().subscribe((result:boolean) => {
      if(result){

        this.courseService.remove(course._id).subscribe({
          next: () => {
            this.refresh();
            this.snackBar.open('Curso removido com sucesso', 'X', {
              duration:5000,
              verticalPosition:'top',
              horizontalPosition:'center'
            });
      },
      error: () => this.onError('Erro ao tentar remover curso.')
    },
    );
      }
    });




}


}
