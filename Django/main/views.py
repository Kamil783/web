from django.shortcuts import render
from django.template import RequestContext
from django.contrib import messages
from django.contrib.auth import logout, authenticate
from django.contrib.auth.models import User, AnonymousUser
from django.http.response import HttpResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from django.views.generic import TemplateView
from main.forms import RegisterForm, LoginForm
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login as auth_login



 
 
#def e_handler404(request):
 #   context = RequestContext(request)
  #  response = render(request, 'error404.html', context)
   # response.status_code = 404
    #return response
 
 
def e_handler500(request):
    context = RequestContext(request)
    response = render(None, 'error500.html', context)
    response.status_code = 500
    return response

class somethingwrong(TemplateView):
    template_name = 'main/error404.html'

class HomeView(TemplateView):
        def dispatch(self, request, *args, **kwargs):
            if(request.user.is_active != AnonymousUser.is_active):
                template_name = 'main/MainPage.html'
                return render(request, template_name, None)
            else:
                template_name = 'main/SignIn.html'
            form = LoginForm(data = request.POST or None)
            if form.is_valid():
                user = authenticate(username = form.cleaned_data['username'], password = form.cleaned_data['password'])
                if user:
                    if user.is_active:
                            auth_login(request, user)
                            return redirect("home")

            context = {
                'form': form
            }
            return render(request, template_name, context)

        def login_user(self, form):
            authenticate(username = form.cleaned_data['username'], password = form.cleaned_data['password'])
        


class RegisterView(TemplateView):
        template_name = 'main/SignUp.html'

        def dispatch(self, request, *args, **kwargs):
            form = RegisterForm()
            if request.method == 'POST':
                form = RegisterForm(request.POST)
                if form.is_valid():
                    self.create_new_user(form)
                    return redirect("signin")
            context = {
                'form': form
            }
            return render(request, self.template_name, context)

        def create_new_user(self, form):
            User.objects.create_user(form.cleaned_data['username'], form.cleaned_data['password1'], form.cleaned_data['password2'])

class LoginView(TemplateView):
    template_name = 'main/SignIn.html'
 
    def dispatch(self, request, *args, **kwargs):
        form = LoginForm(data = request.POST or None)
        if form.is_valid():
            user = authenticate(username = form.cleaned_data['username'], password = form.cleaned_data['password'])
            if user:
                if user.is_active:
                        auth_login(request, user)
                        return redirect("home")

        context = {
              'form': form
        }
        return render(request, self.template_name, context)

    def login_user(self, form):
        authenticate(username = form.cleaned_data['username'], password = form.cleaned_data['password'])

class Chats(TemplateView):
    template_name = 'main/ChatRoom.html'

class Games(TemplateView):
    template_name = 'main/Games.html'

class LogoutView(View):
    def dispatch(self, request, *args, **kwargs):
        logout(request)
        return redirect("home")

