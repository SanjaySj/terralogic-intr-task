import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ItemListService } from '../services/item-list.service';
import { Item } from '../models/item-list.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddPostModalComponent } from '../add-post-modal/add-post-modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatIconModule,
  MatButtonModule,
  MatDialogModule,
  MatSnackBarModule
]

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [...materialModules, CommonModule, ReactiveFormsModule],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemListComponent {

  displayedColumns: string[] = ['id', 'title', 'body'];
  searchTerm = new FormControl('');
  dataSource = new MatTableDataSource<Item>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  sub!: Subscription;

  constructor(private itemService: ItemListService, private matDialog: MatDialog, private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadItems();
    this.sub = this.searchTerm.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged()
      ).subscribe(value => {
        this.applyFilter(value || '');
      })
  }

  applyFilter(value: string) {
    const filterValue = value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadItems(): void {
    this.itemService.getListOfUsers()
      .subscribe((response: Item[]) => {
        this.dataSource.data = response;
      })
  }

  onPaginateChange(event: any): void {
    console.log('Pagination change:', event);
  }

  clearSearch() {
    this.searchTerm.setValue('');
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  addPost() {
    const dialogRef = this.matDialog.open(AddPostModalComponent, { width: '450px' })
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.itemService.addPostRequest(result)
          .subscribe({
            next: (response: Item) => {
              this.matSnackBar.open(`Post added successfully, ID: ${response.id}`, '', {duration: 3000});
              this.dataSource.data = [...this.dataSource.data, response];
            },
            error: () => {
              this.matSnackBar.open('ERROR: Unable to add Post');
            }
          })
      }
    });
  }

}
