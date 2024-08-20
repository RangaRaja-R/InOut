from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    name = models.CharField(max_length=100, blank=False) # can be company name, department, or employee
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100, blank=False)
    role = models.CharField(max_length=20, choices=(
        ("employee", "Employee"),
        ("admin", "Admin"),
        ("department", "Department"),
    ))
    username = None

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.name


class Location(models.Model):
    name = models.CharField(max_length=100, blank=True)
    latitude = models.FloatField(blank=False)
    longitude = models.FloatField(blank=False)


class Offsite(models.Model):
    name = models.CharField(max_length=100, blank=True)
    latitude = models.FloatField(blank=False)
    longitude = models.FloatField(blank=False)
    date = models.DateField()


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.OneToOneField(Location, on_delete=models.CASCADE)
    offsite = models.OneToOneField(Offsite, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.user.name


class Attendance(models.Model):
    user = models.ForeignKey(Employee, on_delete=models.CASCADE)
    check_in = models.DateTimeField(null=False)
    check_out = models.DateTimeField(null=True)
    work_hours = models.FloatField(null=True)

    def __str__(self):
        return f"{self.user} - {self.check_in.date()}"
