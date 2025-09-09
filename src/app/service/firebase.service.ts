import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { GoogleAuthProvider } from 'firebase/auth';
import AuthProvider = firebase.auth.AuthProvider;
import { IFirebaseWriteResult } from '../models/firebaseQuery.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { increment } from 'firebase/firestore';
import localforage from 'localforage';
import { Platform } from '@angular/cdk/platform';
import * as CryptoJS from 'crypto-js';
import { sha256 } from 'js-sha256';
import { Router } from '@angular/router';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Title } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Product } from '../models/product.model';

/// khai báo collection 

const ProductCollection = 'products';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private productCollection: AngularFirestoreCollection<Product>;

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private http: HttpClient,
    private storage: AngularFireStorage,
    private titleService: Title,
    private platform: Platform,
    private analytics: AngularFireAnalytics,
    private router: Router,
  ) {
    this.productCollection = afs.collection<Product>(ProductCollection);
  }

  // --- CREATE ---
  /**
   * Thêm một sản phẩm mới vào collection 'products'.
   * Firestore sẽ tự động tạo ID.
   * @param product Dữ liệu sản phẩm cần thêm
   * @returns Promise chứa DocumentReference của document vừa tạo.
   */
  addProduct(product: Product): Promise<DocumentReference<Product>> {
    return this.productCollection.add(product);
  }
  // --- READ ---
  /**
   * Lấy tất cả sản phẩm từ collection 'products'.
   * @returns Observable chứa mảng sản phẩm.
   */
  getProducts(): Observable<Product[]> {
    return this.productCollection.valueChanges({ idField: 'id' });
  }
  // --- READ BY ID ---
  /**
   * Lấy thông tin sản phẩm dựa trên ID.
   * @param id ID của sản phẩm cần lấy
   * @return Promise chứa thông tin sản phẩm hoặc null nếu không tìm thấy.
   * */
  async getProductById(id: string): Promise<Product | null> {
    const doc = await this.productCollection.doc(id).get().toPromise();
    return doc?.exists ? (doc.data() as Product) : null;
  }
  // --- UPDATE ---
  /**
   * Cập nhật thông tin sản phẩm dựa trên ID.
   * @param id ID của sản phẩm cần cập nhật
   * @param data Dữ liệu mới để cập nhật
   * @returns Promise<void>
   */
  updateProduct(id: string, data: Partial<Product>): Promise<void> {
    return this.productCollection.doc(id).update(data);
  }
  // --- DELETE ---
  /**
   * Xóa một sản phẩm dựa trên ID.
   * @param id ID của sản phẩm cần xóa
   * @returns Promise<void>
   */
  deleteProduct(id: string): Promise<void> {
    return this.productCollection.doc(id).delete();
  }
}
