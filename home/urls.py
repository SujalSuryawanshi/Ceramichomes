# app/urls.py
from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.landing_page, name='home'),
    # PRODUCT URLS
    path('tile-detail/<int:product_id>/', views.product_detail, name='product_detail'),
    path('contact/', views.contact_form, name='contact_form'),
    path("category/<str:name>", views.category_detail, name="category_detail"),
    path("tile_detail/<int:id>", views.tile_detail, name="tile_detail"),
    # AUTH URLS
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    # CART URLS
    path('cart/add/<int:tile_id>/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/update/<int:item_id>/', views.update_cart, name='update_cart'),
    path('cart/data/', views.cart_data, name='cart_data'),
]
