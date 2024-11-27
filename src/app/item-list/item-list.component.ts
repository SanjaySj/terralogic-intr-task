import { Component, ViewChild } from '@angular/core';
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

const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatIconModule,
  MatButtonModule
]

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [...materialModules, CommonModule, ReactiveFormsModule],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent {

  displayedColumns: string[] = ['id', 'title', 'body'];
  itemList: Item[] = [];
  searchText: string = '';
  searchTerm = new FormControl('');
  dataSource = new MatTableDataSource<Item>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  sub!: Subscription;

  constructor(private itemService: ItemListService) { }

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

}
