from django.urls import path
from . import views

urlpatterns = [
    # path('company/register', views.other_register, name='company_register'),  # only admins
    path('company/login', views.login, name='company_login'),
    path('company/logout', views.logout, name='company_logout'),
    #path('department/register', views.department_register, name='department_register'),
    #path('department/login', views.department_login, name='department_login'),
    #path('department/logout', views.department_logout, name='department_logout'),
    path('register', views.register, name='register'),  # only admins
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('all', views.employee_list, name='all'),  # only admins
    path('check-in', views.check_in, name='check_in'),
    path('check-out', views.check_out, name='check_out'),
    path('offsite', views.offsite, name='offsite'),  # only admins
]
