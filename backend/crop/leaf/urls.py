from django.urls import path
from.views import vamsi,create
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns=[
    path("login/",vamsi.as_view(),name="login"),
    path("token/",TokenObtainPairView.as_view(),name="token_pairview"),
    path("refresh/",TokenRefreshView.as_view(),name="refresh_view"),
    path("predict/", create.as_view(), name="crop-predict"),
]