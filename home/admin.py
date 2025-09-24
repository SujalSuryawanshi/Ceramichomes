from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Category, Type, Area, Tile, TileUsageArea, Partners, Trending, Cart, CartItem

# Inline for CartItem to show items within a cart
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('get_subtotal_display', 'added_at')
    fields = ('tile', 'quantity', 'get_subtotal_display', 'added_at')
    verbose_name = "Cart Item"
    verbose_name_plural = "Cart Items"
    
    def get_subtotal_display(self, obj):
        if obj.tile and obj.tile.price_per_sqft:
            return f"₹{obj.get_subtotal():.2f}"
        return "₹0.00"
    get_subtotal_display.short_description = "Subtotal"

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('get_user_display', 'get_total_items', 'get_total_display', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('get_total_display', 'get_total_items', 'created_at', 'updated_at')
    fields = ('user', 'get_total_display', 'get_total_items', 'created_at', 'updated_at')
    inlines = [CartItemInline]
    
    def get_user_display(self, obj):
        if obj.user:
            return obj.user.email
        return f"Anonymous Cart"
    get_user_display.short_description = "User"
    get_user_display.admin_order_field = 'user__email'
    
    def get_total_display(self, obj):
        return f"₹{obj.get_total():.2f}"
    get_total_display.short_description = "Cart Total"
    
    def get_total_items(self, obj):
        return obj.get_total_items()
    get_total_items.short_description = "Total Items"

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('get_user_display', 'tile', 'quantity', 'get_subtotal_display', 'added_at')
    list_filter = ('added_at', 'tile__category', 'tile__material')
    search_fields = ('cart__user__email', 'tile__name', 'tile__brand')
    readonly_fields = ('get_subtotal_display', 'added_at')
    
    def get_user_display(self, obj):
        if obj.cart.user:
            return obj.cart.user.email
        return f"Anonymous ({obj.cart.session_key})"
    get_user_display.short_description = "User"
    get_user_display.admin_order_field = 'cart__user__email'
    
    def get_subtotal_display(self, obj):
        return f"₹{obj.get_subtotal():.2f}"
    get_subtotal_display.short_description = "Subtotal"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'get_products_count')
    search_fields = ('name',)
    
    def get_products_count(self, obj):
        return obj.products.count()
    get_products_count.short_description = "Products Count"

@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Tile)
class TileAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'material', 'price_per_sqft', 'stock_quantity', 'brand')
    list_filter = ('category', 'material', 'finish', 'brand')
    search_fields = ('name', 'brand', 'description')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'brand', 'description')
        }),
        ('Technical Details', {
            'fields': ('material', 'finish', 'design', 'dimensions', 'suitable_for')
        }),
        ('Pricing & Stock', {
            'fields': ('price_per_sqft', 'price_label', 'stock_quantity')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(TileUsageArea)
class TileUsageAreaAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Partners)
class PartnersAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Trending)
class TrendingAdmin(admin.ModelAdmin):
    list_display = ('tile', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('tile__name',)
    readonly_fields = ('created_at',)