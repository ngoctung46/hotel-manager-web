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
        this.addMenuItem({ displayName: 'Phòng', path: '/home', order: 0 });
        this.addMenuItem({ displayName: 'Báo cáo', path: '/report', order: 1 });
        this.addMenuItem({ displayName: 'Thu chi', path: '/expense', order: 2 });
        this.addMenuItem({ displayName: 'Dịch vụ', path: '/product', order: 3 });
        this.addMenuItem({ displayName: 'Nhập kho', path: '/stock', order: 4 });
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
    return this.menuItems
      .valueChanges()
      .pipe(tap(items => items.sort((x, y) => x.order - y.order)));
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
  getRoomById(id: string): Observable<Room> {
    return this.rooms
      .doc(id)
      .snapshotChanges()
      .pipe(
        map(doc => {
          const data = (doc.payload.data() as unknown) as Room;
          const roomId = doc.payload.id;
          return { roomId, ...data };
        })
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
    order.total = 0;
    this.orders.doc(id).set(order);
    return id;
  }

  updateOrder(order: Order, id: string) {
    this.orders.doc(id).update(order);
  }

  getOrderById(id: string): Observable<Order> {
    return this.orders
      .doc<Order>(id)
      .snapshotChanges()
      .pipe(
        map(doc => {
          const data = (doc.payload.data() as unknown) as Order;
          const orderId = doc.payload.id;
          return { orderId, ...data };
        })
      );
  }

  getOrdersByDateRange(start: Date, end: Date): Observable<Order[]> {
    const startTime = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      0,
      0,
      0
    ).getTime();
    const endTime = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate(),
      23,
      59,
      59
    ).getTime();
    const orders = this.afs.collection<Order>(ORDER_COLLECTION, ref =>
      ref.where('checkOutTime', '>=', startTime).where('checkOutTime', '<=', endTime)
    );
    return orders.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Order;
          const orderId = a.payload.doc.id;
          return { orderId, ...data };
        })
      )
    );
  }

  /** ORDER-LINE */
  addOrderLine(orderLine: OrderLine): string {
    const now = new Date().getTime();
    const id = this.afs.createId();
    orderLine.createdAt = now;
    this.orderLines.doc(id).set(orderLine);
    return id;
  }
  updateOrderLine(orderLine: OrderLine, id: string) {
    this.orderLines.doc(id).update(orderLine);
  }

  deleteOrderLine(id: string) {
    this.orderLines.doc(id).delete();
  }

  getOrderLinesByOrderId(orderId: string): Observable<OrderLine[]> {
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
  getStockableProducts(): Observable<Product[]> {
    const products = this.afs.collection(PRODUCT_COLLECTION, ref => ref.where('type', '==', 2));
    return products.snapshotChanges().pipe(
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
  updateProductQty(id: string, quantity: number) {
    this.products.doc(id).update({ inStock: quantity });
  }
  deleteProduct(id: string) {
    this.products.doc(id).delete();
  }
}
