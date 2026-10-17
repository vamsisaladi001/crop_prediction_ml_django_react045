from django.contrib.auth.models import User
from rest_framework import serializers

class serializer(serializers.ModelSerializer):
    password=serializers.CharField(
        write_only=True,
        min_length=6,
        style={"input_type":"password"}
    )
    class Meta:
        model=User
        fields=["username","password"]
    def create(self, validated_data):
        user=User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"]
        )
        return user
from .models import CropPrediction
class CropPredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropPrediction
        fields = [
            "id",
            "nitrogen",
            "phosphorus",
            "potassium",
            "temperature",
            "humidity",
            "ph",
            "rainfall",
            "predicted_crop",
            "created_at",
        ]
        read_only_fields = ["id", "predicted_crop", "created_at"]