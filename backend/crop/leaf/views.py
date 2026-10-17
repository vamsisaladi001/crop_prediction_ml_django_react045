from django.shortcuts import render
from .serializers import serializer
from rest_framework import generics
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from .serializers import CropPredictionSerializer
from django.urls import path
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework import status
from pathlib import Path
import joblib
from .models import CropPrediction
from .models import CropPrediction
# Create your views here.
MODEL_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "leaf"
    / "crop_model.joblib"
)
saved = joblib.load(MODEL_PATH)
model = saved["model"]
features = saved["features"]
class vamsi(CreateAPIView):
    serializer_class=serializer
    permission_classes=[AllowAny]
class create(CreateAPIView):
    serializer_class = CropPredictionSerializer
    permission_classes = [AllowAny]
    def create(self, request, *args, **kwargs):
        print("REQUEST DATA:", request.data)

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("PREDICTION VALIDATION ERROR:", serializer.errors)
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        values = serializer.validated_data

        row = [[
            values["nitrogen"],
            values["phosphorus"],
            values["potassium"],
            values["temperature"],
            values["humidity"],
            values["ph"],
            values["rainfall"],
        ]]
        try:
            predicted_crop = model.predict(row)[0]
            print("PREDICTED CROP:", predicted_crop)

        except Exception as e:
            import traceback
            traceback.print_exc()

            return Response(
                {
                    "error": "ML prediction failed",
                    "details": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            if request.user.is_authenticated:
              CropPrediction.objects.create(
                user=request.user,
                nitrogen=values["nitrogen"],
                phosphorus=values["phosphorus"],
                potassium=values["potassium"],
                temperature=values["temperature"],
                humidity=values["humidity"],
                ph=values["ph"],
                rainfall=values["rainfall"],
                predicted_crop=str(predicted_crop),
        )

        return Response(
            {"predicted_crop": str(predicted_crop)},
            status=status.HTTP_200_OK,
        )