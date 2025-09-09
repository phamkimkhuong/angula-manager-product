import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { GoogleAuthProvider } from 'firebase/auth';
import AuthProvider = firebase.auth.AuthProvider;
import { IUser } from 'src/app/models/user.model';
import { IFirebaseWriteResult } from '../models/firebaseQuery.model';
import { IHistory } from '../models/History.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { increment } from 'firebase/firestore';
import { ICode } from '../models/question.model';
import localforage from 'localforage';
import { Platform } from '@angular/cdk/platform';
import * as CryptoJS from 'crypto-js';
import { sha256 } from 'js-sha256';
import { Router } from '@angular/router';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Title } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/compat/storage';

/// khai báo collection 
const UserCollection = 'users';
const BillCollection = 'bills';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private http: HttpClient,
    private storage: AngularFireStorage,
    private titleService: Title,
    private platform: Platform,
    private analytics: AngularFireAnalytics,
    private router: Router,
  ) { }
}
