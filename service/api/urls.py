from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"tracks", views.TrackViewSet)
router.register(r"playlist", views.PlaylistViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('add_playlist',views.create_playist, name='create_playist'),
    path('playlist_with_track/<int:playlist_id>', views.get_all_playist_with_tracks, name='playlist_with_track'),
    path('add_track_to_playlist', views.add_track_to_playlist, name='add_track_to_playlist'),
    path('delete_track_from_playlist/<int:playlist_id>/<str:track_id>', views.delete_track_from_playlist, name='delete_track_from_playlist'),
    path('delete_playlist/<int:playlist_id>', views.delete_playlist, name='delete_playlist')
]
