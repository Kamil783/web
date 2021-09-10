import os, random
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.db.models.signals import post_save

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default="default.png", upload_to='profile_pics')
    friends = models.ManyToManyField("Profile", blank=True)
    status = models.BooleanField(default = False)


    def __str__(self):
        return str(self.user.username)

def post_save_user_model_receiver(sender, instance, created, *args, **kwargs):
    if created:
        try:
            Profile.objects.create(user=instance, image = random.choice(os.listdir(r"C:\Users\Камил\Desktop\Web\Django\main\static\Assets\image\default_avatars")))
        except:
            pass

post_save.connect(post_save_user_model_receiver, sender=settings.AUTH_USER_MODEL)




class FriendRequest(models.Model):
	to_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='to_user', on_delete=models.CASCADE)
	from_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='from_user', on_delete=models.CASCADE)

	def __str__(self):
		return "From {}, to {}".format(self.from_user.username, self.to_user.username)

# Create your models here.
