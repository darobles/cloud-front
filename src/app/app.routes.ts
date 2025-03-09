import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AdminComponent } from './components/admin/admin.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { CheckoutComponent } from './components/shared/checkout/checkout.component';
import { OrdenCompleteComponent } from './components/shared/orden-complete/orden-complete.component';
import { UserComponent } from './components/admin/user/user.component';
import { AuthGuard } from '../auth-guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'complete', component: OrdenCompleteComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]  },
    { path: 'users', component: UserComponent, canActivate: [AuthGuard]  },
];
