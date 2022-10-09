import { Component, OnInit } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { SeoService } from 'src/app/services/seo.service';


@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {
  customers: any;

  constructor(private seo: SeoService, private db: Firestore) { }

  ngOnInit() {
    this.seo.generateTags({
      title: 'Customer List',
      description: 'A list filled with customers'
    });

    this.customers = collectionData(
      collection(this.db, 'customers'),
      { idField: 'id' }
    );
  }
}