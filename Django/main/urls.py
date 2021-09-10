from django.urls import path
from . import views
from main.views import HomeView, Chats, somethingwrong, Games, RegisterView, LoginView, LogoutView


urlpatterns = [
    path('', HomeView.as_view(), name="home"),
    path('massenger', Chats.as_view(), name="chats"),
    path('calendar', somethingwrong.as_view(), name="calendar"),
    path('teams', somethingwrong.as_view(), name="teams"),
    path('games', Games.as_view(), name="games"),
    path('signin', LoginView.as_view(), name="signin"),
    path('signup', RegisterView.as_view(), name="signup"),
    path('logout', LogoutView.as_view(), name="logout")
]