from .models import Category, Tile, Partners, Tile, Cart, CartItem
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from users.models import CustomUser
from .forms import CustomUserCreationForm
import json
from django.contrib import messages
from django import forms
def landing_page(request):
    """
    Landing page view with all the required data
    """
    # Get all categories for the first carousel
    categories = Category.objects.all()  # Limit to 10 for carousel
    
    
    # Get all products for designs section
    products = Tile.objects.all()
    
    # Get featured products (you can add a featured field to Product model or just get first 4)
    featured_products = Tile.objects.all()[:4]
    
    # Get partners for carousel
    partners = Partners.objects.all()
    
    # Get achievements for carousel
    
    context = {
        'categories': categories,
        'products': products,
        'featured_products': featured_products,
        'partners': partners,
    }
    
    return render(request, 'index.html', context)

def category_detail(request, name):
    categories=Category.objects.all()
    try:
        category = Category.objects.get(name=name)
        tiles=category.products.all()        
        context = {
            'category': category,
            'tiles': tiles,
            'categories': categories,
        }
        
        return render(request, 'category_detail.html', context)
    except Category.DoesNotExist:
        return render(request, '404.html', status=404)

def product_detail(request, product_id):
    """
    Product detail view
    """
    try:
        product = Tile.objects.get(id=product_id)
        related_products = Tile.objects.filter(
            category=product.category
        ).exclude(id=product.id)[:4]
        
        context = {
            'product': product,
            'related_products': related_products,
        }
        
        return render(request, 'product_detail.html', context)
    except Tile.DoesNotExist:
        return render(request, '404.html', status=404)

def contact_form(request):
    """
    Handle contact form submission
    """
    if request.method == 'POST':
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        timing = request.POST.get('timing')
        message = request.POST.get('message')
        
        # Here you can save the contact form data to a model or send an email
        # For now, we'll just add a success message
        
        messages.success(request, 'Thank you for your message! We will get back to you soon.')
        


def tile_detail(request, id):
    try:
        tile = Tile.objects.get(id=id)
        categories=Category.objects.all()
        context = {
            'tile': tile,
            'categories': categories,
        }
        return render(request, 'tiles_detail.html', context)
    except Tile.DoesNotExist:
        return render(request, '404.html', status=404)

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid email or password.')
    else:
        form = AuthenticationForm()

    return render(request, 'registration/login.html', {'form': form})


def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, 'Account created successfully! Please log in.')
            return redirect('login')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'registration/register.html', {'form': form})



def get_or_create_cart(request):
    """Helper function to get or create cart for user or session"""
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(
            user=request.user,
            defaults={'session_key': None}
        )
    else:
        if not request.session.session_key:
            request.session.create()
        cart, created = Cart.objects.get_or_create(
            session_key=request.session.session_key,
            user=None
        )
    return cart

def tile_detail(request, id):
    try:
        tile = Tile.objects.get(id=id)
        categories = Category.objects.all()
        
        # Get cart data for the current user/session
        cart = get_or_create_cart(request)
        cart_items = cart.items.all()
        
        context = {
            'tile': tile,
            'categories': categories,
            'cart_items': cart_items,
            'cart_total': cart.get_total(),
            'cart_count': cart.get_total_items(),
        }
        return render(request, 'tiles_detail.html', context)
    except Tile.DoesNotExist:
        return render(request, '404.html', status=404)

@require_POST
def add_to_cart(request, tile_id):
    tile = get_object_or_404(Tile, id=tile_id)
    cart = get_or_create_cart(request)
    
    quantity = int(request.POST.get('quantity', 1))
    
    # Check if item already exists in cart
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        tile=tile,
        defaults={'quantity': quantity}
    )
    
    if not created:
        cart_item.quantity += quantity
        cart_item.save()
        message = f"Updated {tile.name} quantity to {cart_item.quantity}"
    else:
        message = f"Added {tile.name} to cart"
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'message': message,
            'cart_count': cart.get_total_items(),
            'cart_total': float(cart.get_total())
        })
    
    messages.success(request, message)
    return redirect('tile_detail', id=tile_id)

@require_POST
def remove_from_cart(request, item_id):
    cart = get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    
    tile_name = cart_item.tile.name
    cart_item.delete()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'message': f"Removed {tile_name} from cart",
            'cart_count': cart.get_total_items(),
            'cart_total': float(cart.get_total())
        })
    
    messages.success(request, f"Removed {tile_name} from cart")
    return redirect(request.META.get('HTTP_REFERER', '/'))

@require_POST
def update_cart(request, item_id):
    cart = get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    
    try:
        new_quantity = int(request.POST.get('quantity', 1))
        if new_quantity > 0:
            cart_item.quantity = new_quantity
            cart_item.save()
            message = f"Updated {cart_item.tile.name} quantity to {new_quantity}"
        else:
            tile_name = cart_item.tile.name
            cart_item.delete()
            message = f"Removed {tile_name} from cart"
    except ValueError:
        return JsonResponse({'success': False, 'message': 'Invalid quantity'})
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'message': message,
            'cart_count': cart.get_total_items(),
            'cart_total': float(cart.get_total()),
            'item_subtotal': float(cart_item.get_subtotal()) if cart_item.pk else 0
        })
    
    messages.success(request, message)
    return redirect(request.META.get('HTTP_REFERER', '/'))

def cart_data(request):
    """API endpoint to get cart data"""
    cart = get_or_create_cart(request)
    cart_items = []
    
    for item in cart.items.all():
        cart_items.append({
            'id': item.id,
            'tile_id': item.tile.id,
            'tile_name': item.tile.name,
            'tile_image': item.tile.image.url if item.tile.image else None,
            'price_per_sqft': float(item.tile.price_per_sqft or 0),
            'quantity': item.quantity,
            'subtotal': float(item.get_subtotal())
        })
    
    return JsonResponse({
        'cart_items': cart_items,
        'cart_total': float(cart.get_total()),
        'cart_count': cart.get_total_items()
    })

