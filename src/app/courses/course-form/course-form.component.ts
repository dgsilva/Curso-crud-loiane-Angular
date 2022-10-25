import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from 'src/model/course';
import { Location } from '@angular/common';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form:FormGroup;
  constructor(private formBuilder:FormBuilder, private service: CoursesService,
    private snackBar: MatSnackBar, private location:Location) { 
    this.form = this.formBuilder.group({
      name:[null],
      category:[null]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(){
    this.service.save(this.form.value).subscribe({
      next: result =>{this.onSucess();},
      error:error=>{this.onError();} 
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }
  onCancel(){
    this.location.back();
  }

  private onError(){
    this.snackBar.open('Erro ao salvar curso.', 'X', {duration:5000});
  }
  
  private onSucess(){
    this.snackBar.open('Curso salvo com sucesso', 'X', {duration:5000});
    this.onCancel();
  }

}
