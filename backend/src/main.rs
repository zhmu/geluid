#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate rocket_contrib;

use rocket::State;
use rocket::response::NamedFile;
use rocket::http::Header;
use rocket::{Request, Response};
use rocket::fairing::{AdHoc, Fairing, Info, Kind};
use rocket_contrib::databases::postgres;
use rocket_contrib::json::Json;
use rocket_conditional_attach::ConditionalAttach;
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use serde::Serialize;

struct GeluidDirPrefix(String);
struct StaticFilesPath(String);

#[database("geluid_db")]
struct GeluidDbConn(postgres::Connection);

#[get("/")]
fn index(static_files_path: State<StaticFilesPath>) -> Option<NamedFile> {
    NamedFile::open(Path::new(format!("{}/index.html", static_files_path.0).as_str())).ok()
}

#[get("/<file..>", rank=10)]
fn get_file(file: PathBuf, static_files_path: State<StaticFilesPath>) -> Option<NamedFile> {
    NamedFile::open(Path::new(format!("{}/", static_files_path.0).as_str()).join(file)).ok().or_else(|| NamedFile::open(Path::new(format!("{}/index.html", static_files_path.0).as_str())).ok())
}

fn map_artist_key_to_expr(key: &String) -> Option<&'static str> {
    match key.as_str() {
        "a" => Some("LOWER(name) LIKE 'a%'"),
        "b" => Some("LOWER(name) LIKE 'b%'"),
        "c" => Some("LOWER(name) LIKE 'c%'"),
        "d" => Some("LOWER(name) LIKE 'd%'"),
        "e" => Some("LOWER(name) LIKE 'e%'"),
        "f" => Some("LOWER(name) LIKE 'f%'"),
        "g" => Some("LOWER(name) LIKE 'g%'"),
        "h" => Some("LOWER(name) LIKE 'h%'"),
        "i" => Some("LOWER(name) LIKE 'i%'"),
        "j" => Some("LOWER(name) LIKE 'j%'"),
        "k" => Some("LOWER(name) LIKE 'k%'"),
        "l" => Some("LOWER(name) LIKE 'l%'"),
        "m" => Some("LOWER(name) LIKE 'm%'"),
        "n" => Some("LOWER(name) LIKE 'n%'"),
        "o" => Some("LOWER(name) LIKE 'o%'"),
        "p" => Some("LOWER(name) LIKE 'p%'"),
        "q" => Some("LOWER(name) LIKE 'q%'"),
        "r" => Some("LOWER(name) LIKE 'r%'"),
        "s" => Some("LOWER(name) LIKE 's%'"),
        "t" => Some("LOWER(name) LIKE 't%'"),
        "u" => Some("LOWER(name) LIKE 'u%'"),
        "v" => Some("LOWER(name) LIKE 'v%'"),
        "w" => Some("LOWER(name) LIKE 'w%'"),
        "x" => Some("LOWER(name) LIKE 'x%'"),
        "y" => Some("LOWER(name) LIKE 'y%'"),
        "z" => Some("LOWER(name) LIKE 'z%'"),
        "other" => Some("name !~ '^[a-zA-Z]'"),
        "all" => Some("1=1"),
        _ => None
    }
}

#[derive(Serialize)]
struct Artist {
    artistid: i32,
    name: String,
}

#[derive(Serialize)]
struct Disc {
    discid: i32,
    volume: Option<String>
}

#[derive(Serialize)]
struct Album {
    albumid: i32,
    year: Option<i32>,
    name: String,
    paid: bool,
    discs: Vec<Disc>
}

#[derive(Serialize)]
struct ArtistInfo {
    artist: Artist,
    albums: HashMap<i32, Album>
}

#[derive(Serialize)]
struct Track {
    trackid: i32,
    num: i32,
    length: i32,
    title: String,
    lyrics: bool
}

#[derive(Serialize)]
struct Disc2 {
    discid: i32,
    volume: Option<String>,
    title: Option<String>,
    tracks: Vec<Track>
}

#[derive(Serialize)]
struct Album2 {
    id: i32,
    name: String,
    discs: HashMap<i32, Disc2>
}

#[derive(Serialize)]
struct AlbumInfo {
    artist: Artist,
    album: Album2
}

#[get("/artist/by/<key>")]
fn artist_key(conn: GeluidDbConn, key: String) -> Json<Vec<Artist>> {
    let expr = map_artist_key_to_expr(&key).unwrap();
    let query = format!("SELECT artistid,name FROM artist WHERE {}", expr);

    let mut artists: Vec<Artist> = Vec::new();
    for row in &conn.query(&query, &[ ] ).unwrap() {
        let artist_id: i32 = row.get("artistid");
        let artist_name: String = row.get("name");
        artists.push(Artist{ artistid: artist_id, name: artist_name } );
    }
    Json(artists)
}

#[get("/artist/<id>")]
fn artist_id(conn: GeluidDbConn, id: i32) -> Json<ArtistInfo> {
    let query = "SELECT ar.name AS artistname,al.albumid,al.year,al.name,d.discid,d.volume,EXISTS(SELECT NULL FROM file f WHERE f.albumid=al.albumid) AS paid FROM artist ar,album al,disc d WHERE al.artistid=$1 AND ar.artistid=al.artistid AND d.albumid=al.albumid";

    let mut artist: Option<Artist> = None;
    let mut albums: HashMap<i32, Album> = HashMap::new();
    for row in &conn.query(&query, &[ &id ] ).unwrap() {
        let artistname: String = row.get("artistname");
        let albumid: i32 = row.get("albumid");
        let year: Option<i32> = row.get("year");
        let name: String = row.get("name");
        let discid: i32 = row.get("discid");
        let volume: Option<String> = row.get("volume");
        let paid: bool = row.get("paid");

        if artist.is_none() {
            artist = Some(Artist{ artistid: id, name: artistname });
        }

        if !albums.contains_key(&albumid) {
            albums.insert(albumid, Album{ albumid, year, name, paid, discs: Vec::new() });
        }

        let albums = albums.get_mut(&albumid).unwrap();
        albums.discs.push(Disc{ discid, volume });
    }

    let info = ArtistInfo{ artist: artist.unwrap(), albums };
    Json(info)
}

#[get("/album/<album_id>")]
fn album_id(conn: GeluidDbConn, album_id: i32) -> Json<AlbumInfo> {
    let query = "SELECT ar.name AS artistname,ar.artistid,al.name AS albumname,al.year,d.discid,d.volume,d.title AS dtitle,t.trackid,t.num,t.length,t.title AS ttitle,EXISTS(SELECT NULL FROM paragraph p WHERE p.trackid=t.trackid) AS lyrics FROM album al,disc d,track t,artist ar WHERE al.albumid=$1 AND al.artistid=ar.artistid AND al.albumid=d.albumid AND t.discid=d.discid";

    let mut artist: Option<Artist> = None;
    let mut album: Option<Album2> = None;
    let mut discs: HashMap<i32, Disc2> = HashMap::new();
    for row in &conn.query(&query, &[ &album_id ] ).unwrap() {
        let artist_name: String = row.get("artistname");
        let artist_id: i32 = row.get("artistid");
        let album_name: String = row.get("albumname");
        let _album_year: i32 = row.get("year");
        let disc_id: i32 = row.get("discid");
        let disc_volume: Option<String> = row.get("volume");
        let disc_title: Option<String> = row.get("dtitle");
        let track_id: i32 = row.get("trackid");
        let track_num: i32 = row.get("num");
        let track_length: i32 = row.get("length");
        let track_title: String = row.get("ttitle");
        let lyrics: bool = row.get("lyrics");

        if artist.is_none() {
            artist = Some(Artist{ artistid: artist_id, name: artist_name });
        }
        if album.is_none() {
            album = Some(Album2{ id: album_id, name: album_name, discs: HashMap::new() });
        }

        if !discs.contains_key(&disc_id) {
            discs.insert(disc_id, Disc2{ discid: disc_id, volume: disc_volume, title: disc_title, tracks: Vec::new() });
        }

        let disc = discs.get_mut(&disc_id).unwrap();
        disc.tracks.push(Track{ trackid: track_id, num: track_num, length: track_length, title: track_title, lyrics })
    }

    let mut album = album.unwrap();
    album.discs = discs;
    let info = AlbumInfo{ artist: artist.unwrap(), album };
    Json(info)
}

#[derive(Serialize)]
struct Lyric {
    header: Option<String>,
    lines: HashMap<i32, String>,
}

#[derive(Serialize)]
struct Lyrics {
    lyrics: HashMap<i32, Lyric>,
}

#[get("/track/<track_id>/lyrics")]
fn track_lyrics(conn: GeluidDbConn, track_id: i32) -> Json<Lyrics> {
    let query = "SELECT p.ordernum AS porder,l.ordernum AS lorder,p.header,l.content FROM paragraph p LEFT JOIN line l ON l.paragraphid=p.paragraphid WHERE p.trackid=$1";

    let mut lyrics: HashMap<i32, Lyric> = HashMap::new();
    for row in &conn.query(&query, &[ &track_id] ).unwrap() {
        let porder: i32 = row.get("porder");
        let lorder: Option<i32> = row.get("lorder");
        let header: Option<String> = row.get("header");
        let content: Option<String> = row.get("content");

        let key = porder - 1;
        if !lyrics.contains_key(&key) {
            lyrics.insert(key, Lyric{ header, lines: HashMap::new() });
        }

        let lyric = lyrics.get_mut(&key).unwrap();
        let key = lorder.unwrap_or(1) - 1;
        if !content.is_none() {
            lyric.lines.insert(key, content.unwrap());
        }
    }
    Json(Lyrics{ lyrics })
}

#[derive(Serialize)]
struct TrackEnqueue {
    fileid: i32
}

#[get("/track/<track_id>/enqueue")]
fn track_enqueue(conn: GeluidDbConn, track_id: i32) -> Json<TrackEnqueue> {
    let query = "SELECT f.fileid FROM file f WHERE f.trackid=$1 AND f.filetype='mp3'";

    let mut enqueue = TrackEnqueue{ fileid: 0 };
    for row in &conn.query(&query, &[ &track_id ] ).unwrap() {
        let fileid: i32 = row.get("fileid");
        enqueue.fileid = fileid;
    }
    Json(enqueue)
}

// TODO this is wrong; should be track/.../mp3
#[get("/file/<track_id>/mp3")]
fn track_mp3(conn: GeluidDbConn, geluid_dir_prefix: State<GeluidDirPrefix>, track_id: i32) -> Option<NamedFile> {
    let query = "SELECT path FROM file WHERE trackid=$1 AND filetype='mp3'";

    for row in &conn.query(&query, &[ &track_id ] ).unwrap() {
        let path: String = row.get("path");
        let full_path = format!("{}{}", &geluid_dir_prefix.0, path);
        return NamedFile::open(Path::new(&full_path)).ok();
    }
    None
}

pub struct CORS;

// This fairing allows the backend to be called from any site, which is useful for development
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response
        }
    }

    fn on_response(&self, _request: &Request, response: &mut Response) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

fn main() {
    rocket::ignite()
        .attach(GeluidDbConn::fairing())
        .attach_if(cfg!(debug_assertions), CORS)
        .attach(AdHoc::on_attach("geluid dir prefix", |rocket| {
            let geluid_dir_prefix = rocket.config().get_str("geluid_dir_prefix").unwrap().to_string();
            Ok(rocket.manage(GeluidDirPrefix(geluid_dir_prefix)))
        }))
        .attach(AdHoc::on_attach("static files path", |rocket| {
            let static_files_path = rocket.config().get_str("static_files_path").unwrap().to_string();
            Ok(rocket.manage(StaticFilesPath(static_files_path)))
        }))
        .mount("/", routes![ index, get_file ])
        .mount("/api", routes![index, artist_key, artist_id, album_id, track_lyrics, track_enqueue, track_mp3 ])
        .launch();
}
