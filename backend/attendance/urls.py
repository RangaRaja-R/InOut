from django.urls import path
from . import views

urlpatterns = [
    path('register', views.register, name='register'),  # only admins
    path('login', views.login, name='login'),
    path('code', views.code, name='code'), # only admins
    path('get-code/<str:email>', views.get_code, name='get_code'),
    path('logout', views.logout, name='logout'),
    path('all', views.employee_list, name='all'),  # only admins
    path('locations', views.locations),# only admins
    path('check-in', views.check_in, name='check_in'),
    path('check-out', views.check_out, name='check_out'),
    path('offsite', views.offsite, name='offsite'),  # only admins
    # path('delete', views.delete, name='delete'),
    path('today', views.today, name='today'),
]
