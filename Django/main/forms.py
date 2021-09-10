from django import forms
from django.forms import ModelForm
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import Profile


class RegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username','password1','password2')
        widgets = {
            'username' : forms.TextInput(attrs={'class' : 'form-input'}),
            'password1' : forms.PasswordInput(attrs={'class' : 'form-input'}),
            'password2' : forms.PasswordInput(attrs={'class' : 'form-input'})
        }

    


class LoginForm(AuthenticationForm):
   class Meta:
        model = User
        fields = ('username','password')
        widgets = {
            'username' : forms.TextInput(attrs={'class' : 'form-input'}),
            'password' : forms.PasswordInput(attrs={'class' : 'form-input'})
        }

class ProfileUpdateForm(forms.ModelForm):
	class Meta:
		model = Profile
		fields = ['image']

