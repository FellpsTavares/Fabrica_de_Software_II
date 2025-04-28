from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    #path('local_entrega/', include('local_entrega.urls')),
    #path('familia/', include('familia.urls')),
]
