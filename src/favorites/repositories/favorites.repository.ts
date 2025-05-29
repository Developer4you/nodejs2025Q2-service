export class FavoritesRepository {
    artists: string[] = [];
    albums: string[] = [];
    tracks: string[] = [];

    addArtist(id: string): void {
        if (!this.artists.includes(id)) {
            this.artists.push(id);
        }
    }

    removeArtist(id: string): boolean {
        const index = this.artists.indexOf(id);
        if (index !== -1) {
            this.artists.splice(index, 1);
            return true;
        }
        return false;
    }

    addAlbum(id: string): void {
        if (!this.albums.includes(id)) {
            this.albums.push(id);
        }
    }

    removeAlbum(id: string): boolean {
        const index = this.albums.indexOf(id);
        if (index !== -1) {
            this.albums.splice(index, 1);
            return true;
        }
        return false;
    }

    addTrack(id: string): void {
        if (!this.tracks.includes(id)) {
            this.tracks.push(id);
        }
    }

    removeTrack(id: string): boolean {
        const index = this.tracks.indexOf(id);
        if (index !== -1) {
            this.tracks.splice(index, 1);
            return true;
        }
        return false;
    }

    getAllIds() {
        return {
            artists: [...this.artists],
            albums: [...this.albums],
            tracks: [...this.tracks],
        };
    }
}