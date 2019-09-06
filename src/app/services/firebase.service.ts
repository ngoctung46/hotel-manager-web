import { MenuItem } from './../models/menu-item';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Room } from '../models/room';
import { Customer } from '../models/customer';
import { RoomType } from '../enums';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { OrderLine } from '../models/order-line';

const MENU_COLLECTION = 'menu-items';
const ROOM_COLLECTION = 'rooms';
const CUSTOMER_COLLECTION = 'customers';
const ORDER_COLLECTION = 'orders';
const PRODUCT_COLLECTION = 'products';
const ORDER_LINE_COLLECTION = 'order-lines';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private menuItems: AngularFirestoreCollection<MenuItem>;
  private rooms: AngularFirestoreCollection<Room>;
  private customers: AngularFirestoreCollection<Customer>;
  private orders: AngularFirestoreCollection<Order>;
  private products: AngularFirestoreCollection<Product>;
  private orderLines: AngularFirestoreCollection<OrderLine>;
  constructor(private afs: AngularFirestore) {
    this.menuItems = afs.collection(MENU_COLLECTION);
    this.rooms = afs.collection(ROOM_COLLECTION);
    this.customers = afs.collection(CUSTOMER_COLLECTION);
    this.orders = afs.collection(ORDER_COLLECTION);
    this.products = afs.collection(PRODUCT_COLLECTION);
    this.orderLines = afs.collection(ORDER_LINE_COLLECTION);
  }

  initMenu() {
    this.menuItems.valueChanges().subscribe(items => {
      if (items.length <= 0) {
        this.addMenuItem({ displayName: 'Home', path: '/home', order: 0 });
        this.addMenuItem({ displayName: 'Reports', path: '/report', order: 1 });
        this.addMenuItem({ displayName: 'Expenses', path: '/expense', order: 2 });
        this.addMenuItem({ displayName: 'Services', path: '/service', order: 3 });
        this.addMenuItem({ displayName: 'Products', path: '/product', order: 4 });
      }
    });
  }

  initRooms() {
    this.rooms.valueChanges().subscribe(rooms => {
      let roomRate: number;
      let roomType: number;
      if (rooms.length <= 0) {
        for (let i = 1; i <= 3; i++) {
          for (let j = 1; j <= 4; j++) {
            if (j === 1) {
              roomRate = 450_000;
              roomType = RoomType.Double;
            } else {
              roomRate = 350_000;
              roomType = RoomType.Single;
            }
            this.addRoom({ number: i * 100 + j, rate: roomRate, type: roomType, occupied: false });
          }
        }
      }
    });
  }

  /** MENU ITEM */
  addMenuItem(item: MenuItem) {
    this.menuItems.add(item);
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItems.valueChanges().pipe(tap(items => items.sort(x => x.order)));
  }

  /** ROOM */
  addRoom(room: Room) {
    this.rooms.add(room);
  }

  updateRoom(id: string, obj: any) {
    this.rooms.doc(id).update(obj);
  }

  getRooms(): Observable<Room[]> {
    return this.rooms.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Room;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  /** CUSTOMER */
  addCustomer(customer: Customer) {
    this.customers.doc(customer.idNumber).set(customer);
  }

  getCustomers(): Observable<Customer[]> {
    return this.customers.valueChanges();
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.customers.doc<Customer>(id).valueChanges();
  }

  /** ORDER */
  addOrder(order: Order): string {
    const id = this.afs.createId();
    this.orders.doc(id).set(order);
    return id;
  }

  updateOrder(order: Order, id: string) {
    this.orders.doc(id).update(order);
  }

  getOrderById(id: string): Observable<Order> {
    return this.orders.doc<Order>(id).valueChanges();
  }

  /** ORDER-LINE */
  addOrderLine(orderLine: OrderLine): string {
    const id = this.afs.createId();
    this.orderLines.doc(id).set(orderLine);
    return id;
  }
  updateOrderLine(orderLine: OrderLine, id: string) {
    this.orderLines.doc(id).update(orderLine);
  }

  deleteOrderLine(id: string) {
    this.orderLines.doc(id).delete();
  }

  getOrderLinesByOrderId(orderId: string) {
    return this.afs
      .collection<OrderLine>(ORDER_LINE_COLLECTION, ref => ref.where('orderId', '==', orderId))
      .valueChanges();
  }
  getOrderLineByProductIdAndOrderId(productId: string, orderId: string): Observable<OrderLine> {
    const collection = this.afs.collection<OrderLine>(ORDER_LINE_COLLECTION, ref =>
      ref
        .where('productId', '==', productId)
        .where('orderId', '==', orderId)
        .limit(1)
    );
    return collection.snapshotChanges().pipe(
      map(
        actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as OrderLine;
            const id = a.payload.doc.id;
            return { id, ...data };
          })[0]
      )
    );
  }

  /** PRODUCT */
  getProducts(): Observable<Product[]> {
    return this.products.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Product;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }
  addProduct(product: Product): string {
    const id = this.afs.createId();
    this.products.doc(id).set(product);
    return id;
  }
  updateProduct(product: Product, id: string) {
    this.products.doc(id).update(product);
  }
  deleteProduct(id: string) {
    this.products.doc(id).delete();
  }
}
