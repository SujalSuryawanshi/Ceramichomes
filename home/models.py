from django.db import models
from multiselectfield import MultiSelectField
from Ceramic import settings
import uuid
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)
    def __str__(self):
        return self.name
class Type(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Area(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Tile(models.Model):
    MATERIAL_CHOICES = [
        ('ceramic', 'Ceramic'),
        ('porcelain', 'Porcelain'),
        ('marble', 'Marble'),
        ('granite', 'Granite'),
        ('wood', 'Wood'),
        ('glass', 'Glass'),
        ('stone', 'Stone'),
        ('forever', 'Forever'),  # Based on your example
    ]

    FINISH_CHOICES = [
        ('matte', 'Matte'),
        ('glossy', 'Glossy'),
        ('satin', 'Satin'),
        ('textured', 'Textured'),
        # add more if needed
    ]

    SUITABLE_FOR_CHOICES = [
        ('bathroom', 'Bathroom Tiles'),
        ('living_room', 'Living Room Tiles'),
        ('bedroom', 'Bedroom Tiles'),
        ('accent', 'Accent Tiles'),
        ('hospital', 'Hospital Tiles'),
        ('high_traffic', 'High Traffic Tiles'),
        ('bar', 'Bar/Restaurant'),
        ('commercial', 'Commercial/Office'),
        ('outdoor', 'Outdoor Area'),
    ]

    name = models.CharField(max_length=255)
    material = models.CharField(max_length=100, choices=MATERIAL_CHOICES, null=True, blank=True)
    finish = models.CharField(max_length=50, choices=FINISH_CHOICES, null=True, blank=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    design = models.CharField(max_length=100, null=True, blank=True)  # e.g., Marble, Wood-look, etc.
    dimensions = models.CharField(max_length=50, null=True, blank=True)  # e.g., "600x600 mm"
    
    price_per_sqft = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_label = models.CharField(max_length=100, default='Offer Price Rs', help_text="Prefix for price display", null=True, blank=True)
    
    suitable_for = MultiSelectField(choices=SUITABLE_FOR_CHOICES, null=True, blank=True)
    
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='tiles/', blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)
    
    stock_quantity = models.IntegerField(default=0, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class TileUsageArea(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class Partners(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='partner_images/', blank=True, null=True)
    def __str__(self):
        return self.name
    

class Trending(models.Model):
    tile = models.ForeignKey(Tile, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    img1=models.ImageField(upload_to='trending/', blank=True, null=True)
    img2=models.ImageField(upload_to='trending/', blank=True, null=True)
    img3=models.ImageField(upload_to='trending/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Trending: {self.tile.name}"
    


class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [['user', 'session_key']]

    def __str__(self):
        if self.user:
            return f"Cart for {self.user.email}"
        return f"Anonymous Cart {self.session_key}"

    def get_total(self):
        return sum(item.get_subtotal() for item in self.items.all())

    def get_total_items(self):
        return sum(item.quantity for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    tile = models.ForeignKey(Tile, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['cart', 'tile']]

    def __str__(self):
        return f"{self.quantity} x {self.tile.name}"

    def get_subtotal(self):
        return self.quantity * (self.tile.price_per_sqft or 0)

