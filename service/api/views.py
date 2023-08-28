from rest_framework import permissions, viewsets, decorators, status
from rest_framework.response import Response
from . import models, serializers


class TrackViewSet(viewsets.ModelViewSet):
    queryset = models.Track.objects.all()
    serializer_class = serializers.TrackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = models.Playlist.objects.all()
    serializer_class = serializers.PlaylistSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
@decorators.api_view(['POST'])
def create_playist(request):
    if request.method == 'POST':
        serializer = serializers.PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@decorators.api_view(['GET'])
def get_all_playist_with_tracks(request,playlist_id):
    playlist_tracks = models.PlaylistTracks.objects.filter(playlist_id=playlist_id)
    playlist_serializer = serializers.PlaylistTracksSerializer(playlist_tracks, many=True)
    
    return Response(playlist_serializer.data)        
        
@decorators.api_view(['POST'])
def add_track_to_playlist(request):
    if request.method == 'POST':
        serializer = serializers.PlaylistTracksSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@decorators.api_view(['DELETE'])
def delete_track_from_playlist(request, playlist_id, track_id):
    try:
        # print(request.data.get('playlist_id'))
        playist_track = models.PlaylistTracks.objects.filter(playlist_id=playlist_id,track_id=track_id)
    except models.PlaylistTracks.DoesNotExist:
        return Response({'error': 'Playlist track not found'}, status=404)
    playist_track.delete()
    return Response({'message': 'Playlist track deleted'}, status=status.HTTP_204_NO_CONTENT)

@decorators.api_view(['DELETE'])
def delete_playlist(request, playlist_id):
    try:
        playist = models.Playlist.objects.get(pk=playlist_id)
    except models.Playlist.DoesNotExist:
        return Response({'error': 'Playlist not found'}, status=404)
    playist.delete()
    return Response({'message': 'Playlist deleted'}, status=status.HTTP_204_NO_CONTENT)
