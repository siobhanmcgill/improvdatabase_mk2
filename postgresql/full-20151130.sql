--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.1
-- Dumped by pg_dump version 9.4.4
-- Started on 2015-11-30 18:25:28

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 202 (class 3079 OID 12723)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3039 (class 0 OID 0)
-- Dependencies: 202
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 172 (class 1259 OID 16395)
-- Name: comedygroup; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE comedygroup (
    "GroupID" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Description" text NOT NULL,
    "Email" character varying(50) NOT NULL,
    "URL" character varying(50) NOT NULL,
    "DateAdded" timestamp without time zone NOT NULL,
    "DateModified" timestamp without time zone NOT NULL,
    "AddedUserID" integer NOT NULL,
    "ModifiedUserID" integer NOT NULL
);


ALTER TABLE comedygroup OWNER TO sdbuatyadcczhj;

--
-- TOC entry 173 (class 1259 OID 16401)
-- Name: comedygroup_GroupID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "comedygroup_GroupID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "comedygroup_GroupID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3040 (class 0 OID 0)
-- Dependencies: 173
-- Name: comedygroup_GroupID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "comedygroup_GroupID_seq" OWNED BY comedygroup."GroupID";


--
-- TOC entry 174 (class 1259 OID 16403)
-- Name: duration; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE duration (
    "DurationID" bigint NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Description" text,
    "Min" integer,
    "Max" integer,
    "DateAdded" timestamp without time zone NOT NULL,
    "DateModified" timestamp without time zone NOT NULL,
    "AddedUserID" integer NOT NULL,
    "ModifiedUserID" integer NOT NULL
);


ALTER TABLE duration OWNER TO sdbuatyadcczhj;

--
-- TOC entry 175 (class 1259 OID 16409)
-- Name: duration_DurationID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "duration_DurationID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "duration_DurationID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3041 (class 0 OID 0)
-- Dependencies: 175
-- Name: duration_DurationID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "duration_DurationID_seq" OWNED BY duration."DurationID";


--
-- TOC entry 176 (class 1259 OID 16411)
-- Name: game; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE game (
    "GameID" integer NOT NULL,
    "DateModified" timestamp without time zone NOT NULL,
    "DateAdded" timestamp without time zone NOT NULL,
    "Description" text,
    "DurationID" integer,
    "PlayerCountID" integer,
    "AddedUserID" integer NOT NULL,
    "ModifiedUserID" integer NOT NULL,
    "ParentGameID" integer
);


ALTER TABLE game OWNER TO sdbuatyadcczhj;

--
-- TOC entry 177 (class 1259 OID 16417)
-- Name: game_GameID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "game_GameID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "game_GameID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3042 (class 0 OID 0)
-- Dependencies: 177
-- Name: game_GameID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "game_GameID_seq" OWNED BY game."GameID";


--
-- TOC entry 178 (class 1259 OID 16419)
-- Name: name; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE name (
    "NameID" integer NOT NULL,
    "GameID" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Weight" integer NOT NULL,
    "DateAdded" timestamp without time zone NOT NULL,
    "DateModified" timestamp without time zone NOT NULL,
    "AddedUserID" integer NOT NULL,
    "ModifiedUserID" integer NOT NULL
);


ALTER TABLE name OWNER TO sdbuatyadcczhj;

--
-- TOC entry 179 (class 1259 OID 16422)
-- Name: name_NameID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "name_NameID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "name_NameID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3043 (class 0 OID 0)
-- Dependencies: 179
-- Name: name_NameID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "name_NameID_seq" OWNED BY name."NameID";


--
-- TOC entry 180 (class 1259 OID 16424)
-- Name: note; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE note (
    "NoteID" integer NOT NULL,
    "GameID" integer,
    "Description" text NOT NULL,
    "Public" smallint NOT NULL,
    "DateAdded" timestamp without time zone NOT NULL,
    "DateModified" timestamp without time zone NOT NULL,
    "AddedUserID" integer NOT NULL,
    "ModifiedUserID" integer NOT NULL,
    "TagID" integer,
    "DurationID" integer,
    "PlayerCountID" integer
);


ALTER TABLE note OWNER TO sdbuatyadcczhj;

--
-- TOC entry 181 (class 1259 OID 16430)
-- Name: note_NoteID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "note_NoteID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "note_NoteID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3044 (class 0 OID 0)
-- Dependencies: 181
-- Name: note_NoteID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "note_NoteID_seq" OWNED BY note."NoteID";


--
-- TOC entry 182 (class 1259 OID 16432)
-- Name: permissionkey; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE permissionkey (
    "Name" character varying(20),
    "PermissionKeyID" bigint NOT NULL
);


ALTER TABLE permissionkey OWNER TO sdbuatyadcczhj;

--
-- TOC entry 183 (class 1259 OID 16435)
-- Name: permissionkey_PermissionKeyID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "permissionkey_PermissionKeyID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "permissionkey_PermissionKeyID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3045 (class 0 OID 0)
-- Dependencies: 183
-- Name: permissionkey_PermissionKeyID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "permissionkey_PermissionKeyID_seq" OWNED BY permissionkey."PermissionKeyID";


--
-- TOC entry 184 (class 1259 OID 16437)
-- Name: permissionkeyuserlevel; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE permissionkeyuserlevel (
    "PermissionKeyUserLevelID" bigint NOT NULL,
    "PermissionKeyID" bigint,
    "UserLevelID" bigint
);


ALTER TABLE permissionkeyuserlevel OWNER TO sdbuatyadcczhj;

--
-- TOC entry 185 (class 1259 OID 16440)
-- Name: permissionkeyuserlevel_PermissionKeyUserLevelID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "permissionkeyuserlevel_PermissionKeyUserLevelID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "permissionkeyuserlevel_PermissionKeyUserLevelID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3046 (class 0 OID 0)
-- Dependencies: 185
-- Name: permissionkeyuserlevel_PermissionKeyUserLevelID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "permissionkeyuserlevel_PermissionKeyUserLevelID_seq" OWNED BY permissionkeyuserlevel."PermissionKeyUserLevelID";


--
-- TOC entry 186 (class 1259 OID 16442)
-- Name: playercount; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE playercount (
    "PlayerCountID" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Description" text,
    "Min" integer,
    "Max" integer,
    "DateAdded" timestamp without time zone NOT NULL,
    "DateModified" timestamp without time zone NOT NULL,
    "AddedUserID" integer NOT NULL,
    "ModifiedUserID" integer NOT NULL
);


ALTER TABLE playercount OWNER TO sdbuatyadcczhj;

--
-- TOC entry 187 (class 1259 OID 16448)
-- Name: playercount_PlayerCountID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "playercount_PlayerCountID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "playercount_PlayerCountID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3047 (class 0 OID 0)
-- Dependencies: 187
-- Name: playercount_PlayerCountID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "playercount_PlayerCountID_seq" OWNED BY playercount."PlayerCountID";


--
-- TOC entry 188 (class 1259 OID 16450)
-- Name: suggestion; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE suggestion (
    "SuggestionID" integer NOT NULL,
    "SuggestionTypeID" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "DateAdded" timestamp without time zone NOT NULL,
    "DateModified" timestamp without time zone NOT NULL,
    "AddedUserID" integer NOT NULL,
    "ModifiedUserID" integer NOT NULL
);


ALTER TABLE suggestion OWNER TO sdbuatyadcczhj;

--
-- TOC entry 189 (class 1259 OID 16453)
-- Name: suggestion_SuggestionID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "suggestion_SuggestionID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "suggestion_SuggestionID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3048 (class 0 OID 0)
-- Dependencies: 189
-- Name: suggestion_SuggestionID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "suggestion_SuggestionID_seq" OWNED BY suggestion."SuggestionID";


--
-- TOC entry 190 (class 1259 OID 16455)
-- Name: suggestiontype; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE suggestiontype (
    "SuggestionTypeID" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Description" text,
    "DateAdded" timestamp without time zone NOT NULL,
    "DateModified" timestamp without time zone NOT NULL,
    "AddedUserID" integer NOT NULL,
    "ModifiedUserID" integer NOT NULL
);


ALTER TABLE suggestiontype OWNER TO sdbuatyadcczhj;

--
-- TOC entry 191 (class 1259 OID 16461)
-- Name: suggestiontype_SuggestionTypeID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "suggestiontype_SuggestionTypeID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "suggestiontype_SuggestionTypeID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3049 (class 0 OID 0)
-- Dependencies: 191
-- Name: suggestiontype_SuggestionTypeID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "suggestiontype_SuggestionTypeID_seq" OWNED BY suggestiontype."SuggestionTypeID";


--
-- TOC entry 192 (class 1259 OID 16463)
-- Name: suggestiontypegame; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE suggestiontypegame (
    "SuggestionTypeGameID" integer NOT NULL,
    "SuggestionTypeID" integer NOT NULL,
    "GameID" integer NOT NULL,
    "Description" text,
    "DateAdded" timestamp without time zone NOT NULL,
    "AddedUserID" integer NOT NULL
);


ALTER TABLE suggestiontypegame OWNER TO sdbuatyadcczhj;

--
-- TOC entry 193 (class 1259 OID 16469)
-- Name: suggestiontypegame_SuggestionTypeGameID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "suggestiontypegame_SuggestionTypeGameID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "suggestiontypegame_SuggestionTypeGameID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3050 (class 0 OID 0)
-- Dependencies: 193
-- Name: suggestiontypegame_SuggestionTypeGameID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "suggestiontypegame_SuggestionTypeGameID_seq" OWNED BY suggestiontypegame."SuggestionTypeGameID";


--
-- TOC entry 194 (class 1259 OID 16471)
-- Name: tag; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE tag (
    "TagID" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "Description" text,
    "DateAdded" timestamp without time zone NOT NULL,
    "AddedUserID" integer NOT NULL,
    "ModifiedUserID" integer NOT NULL
);


ALTER TABLE tag OWNER TO sdbuatyadcczhj;

--
-- TOC entry 195 (class 1259 OID 16477)
-- Name: tag_TagID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "tag_TagID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "tag_TagID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3051 (class 0 OID 0)
-- Dependencies: 195
-- Name: tag_TagID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "tag_TagID_seq" OWNED BY tag."TagID";


--
-- TOC entry 196 (class 1259 OID 16479)
-- Name: taggame; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE taggame (
    "TagGameID" integer NOT NULL,
    "TagID" integer NOT NULL,
    "GameID" integer NOT NULL,
    "DateAdded" timestamp without time zone NOT NULL,
    "AddedUserID" integer NOT NULL,
    "ModifiedUserID" integer NOT NULL
);


ALTER TABLE taggame OWNER TO sdbuatyadcczhj;

--
-- TOC entry 197 (class 1259 OID 16482)
-- Name: taggame_TagGameID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "taggame_TagGameID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "taggame_TagGameID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3052 (class 0 OID 0)
-- Dependencies: 197
-- Name: taggame_TagGameID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "taggame_TagGameID_seq" OWNED BY taggame."TagGameID";


--
-- TOC entry 198 (class 1259 OID 16484)
-- Name: userlevel; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE userlevel (
    "UserLevelID" bigint NOT NULL,
    "Name" character varying(50)
);


ALTER TABLE userlevel OWNER TO sdbuatyadcczhj;

--
-- TOC entry 199 (class 1259 OID 16487)
-- Name: userLevel_UserLevelID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "userLevel_UserLevelID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "userLevel_UserLevelID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3053 (class 0 OID 0)
-- Dependencies: 199
-- Name: userLevel_UserLevelID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "userLevel_UserLevelID_seq" OWNED BY userlevel."UserLevelID";


--
-- TOC entry 200 (class 1259 OID 16489)
-- Name: users; Type: TABLE; Schema: public; Owner: improvdatabase; Tablespace: 
--

CREATE TABLE users (
    "UserID" bigint NOT NULL,
    "FirstName" character varying(50) NOT NULL,
    "LastName" character varying(50) NOT NULL,
    "Gender" character varying(1),
    "Email" character varying(50) DEFAULT NULL::character varying,
    "URL" character varying(50) DEFAULT NULL::character varying,
    "DateAdded" timestamp without time zone NOT NULL,
    "DateModified" timestamp without time zone NOT NULL,
    "Password" character(60),
    "UserLevel" bigint[],
    "Locked" boolean DEFAULT false,
    "Description" text DEFAULT ''::text
);


ALTER TABLE users OWNER TO sdbuatyadcczhj;

--
-- TOC entry 201 (class 1259 OID 16499)
-- Name: users_UserID_seq; Type: SEQUENCE; Schema: public; Owner: improvdatabase
--

CREATE SEQUENCE "users_UserID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "users_UserID_seq" OWNER TO sdbuatyadcczhj;

--
-- TOC entry 3054 (class 0 OID 0)
-- Dependencies: 201
-- Name: users_UserID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: improvdatabase
--

ALTER SEQUENCE "users_UserID_seq" OWNED BY users."UserID";


--
-- TOC entry 2840 (class 2604 OID 16501)
-- Name: GroupID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY comedygroup ALTER COLUMN "GroupID" SET DEFAULT nextval('"comedygroup_GroupID_seq"'::regclass);


--
-- TOC entry 2841 (class 2604 OID 16502)
-- Name: DurationID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY duration ALTER COLUMN "DurationID" SET DEFAULT nextval('"duration_DurationID_seq"'::regclass);


--
-- TOC entry 2842 (class 2604 OID 16503)
-- Name: GameID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY game ALTER COLUMN "GameID" SET DEFAULT nextval('"game_GameID_seq"'::regclass);


--
-- TOC entry 2843 (class 2604 OID 16504)
-- Name: NameID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY name ALTER COLUMN "NameID" SET DEFAULT nextval('"name_NameID_seq"'::regclass);


--
-- TOC entry 2844 (class 2604 OID 16505)
-- Name: NoteID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY note ALTER COLUMN "NoteID" SET DEFAULT nextval('"note_NoteID_seq"'::regclass);


--
-- TOC entry 2845 (class 2604 OID 16506)
-- Name: PermissionKeyID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY permissionkey ALTER COLUMN "PermissionKeyID" SET DEFAULT nextval('"permissionkey_PermissionKeyID_seq"'::regclass);


--
-- TOC entry 2846 (class 2604 OID 16507)
-- Name: PermissionKeyUserLevelID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY permissionkeyuserlevel ALTER COLUMN "PermissionKeyUserLevelID" SET DEFAULT nextval('"permissionkeyuserlevel_PermissionKeyUserLevelID_seq"'::regclass);


--
-- TOC entry 2847 (class 2604 OID 16508)
-- Name: PlayerCountID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY playercount ALTER COLUMN "PlayerCountID" SET DEFAULT nextval('"playercount_PlayerCountID_seq"'::regclass);


--
-- TOC entry 2848 (class 2604 OID 16509)
-- Name: SuggestionID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY suggestion ALTER COLUMN "SuggestionID" SET DEFAULT nextval('"suggestion_SuggestionID_seq"'::regclass);


--
-- TOC entry 2849 (class 2604 OID 16510)
-- Name: SuggestionTypeID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY suggestiontype ALTER COLUMN "SuggestionTypeID" SET DEFAULT nextval('"suggestiontype_SuggestionTypeID_seq"'::regclass);


--
-- TOC entry 2850 (class 2604 OID 16511)
-- Name: SuggestionTypeGameID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY suggestiontypegame ALTER COLUMN "SuggestionTypeGameID" SET DEFAULT nextval('"suggestiontypegame_SuggestionTypeGameID_seq"'::regclass);


--
-- TOC entry 2851 (class 2604 OID 16512)
-- Name: TagID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY tag ALTER COLUMN "TagID" SET DEFAULT nextval('"tag_TagID_seq"'::regclass);


--
-- TOC entry 2852 (class 2604 OID 16513)
-- Name: TagGameID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY taggame ALTER COLUMN "TagGameID" SET DEFAULT nextval('"taggame_TagGameID_seq"'::regclass);


--
-- TOC entry 2853 (class 2604 OID 16514)
-- Name: UserLevelID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY userlevel ALTER COLUMN "UserLevelID" SET DEFAULT nextval('"userLevel_UserLevelID_seq"'::regclass);


--
-- TOC entry 2858 (class 2604 OID 16515)
-- Name: UserID; Type: DEFAULT; Schema: public; Owner: improvdatabase
--

ALTER TABLE ONLY users ALTER COLUMN "UserID" SET DEFAULT nextval('"users_UserID_seq"'::regclass);


--
-- TOC entry 3002 (class 0 OID 16395)
-- Dependencies: 172
-- Data for Name: comedygroup; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY comedygroup ("GroupID", "Name", "Description", "Email", "URL", "DateAdded", "DateModified", "AddedUserID", "ModifiedUserID") FROM stdin;
\.


--
-- TOC entry 3055 (class 0 OID 0)
-- Dependencies: 173
-- Name: comedygroup_GroupID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"comedygroup_GroupID_seq"', 1, false);


--
-- TOC entry 3004 (class 0 OID 16403)
-- Dependencies: 174
-- Data for Name: duration; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY duration ("DurationID", "Name", "Description", "Min", "Max", "DateAdded", "DateModified", "AddedUserID", "ModifiedUserID") FROM stdin;
1	3 to 5 minutes	This is definitely complicated, I know. Hey, wait, I'm just a little box of text, what do I know?	3	5	2013-11-04 20:32:31	2013-11-04 20:38:27	1	1
2	5 to 10 minutes	This could be a bit long, but I'm sure it's worth it, right?	5	10	2013-11-04 20:35:45	2013-11-04 20:35:45	1	1
3	Less than 5 minutes	It's hard to say, really, but this certainly won't take longer than five minutes.	0	5	2013-11-04 20:37:09	2013-11-04 20:39:10	1	1
4	Less than 3 Minutes	This is short and sweet. It might not actually be that sweet, because I don't know everything, but I do know that it's short.	0	3	2013-11-22 09:50:02	2013-11-22 09:50:02	1	1
5	5 Minutes	You can almost set you watch to this game, which may or may not actually be a part of it.	5	5	2013-11-22 09:57:26	2013-11-22 09:57:26	1	1
\.


--
-- TOC entry 3056 (class 0 OID 0)
-- Dependencies: 175
-- Name: duration_DurationID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"duration_DurationID_seq"', 5, true);


--
-- TOC entry 3006 (class 0 OID 16411)
-- Dependencies: 176
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY game ("GameID", "DateModified", "DateAdded", "Description", "DurationID", "PlayerCountID", "AddedUserID", "ModifiedUserID", "ParentGameID") FROM stdin;
2	2013-11-04 21:08:34	2013-11-04 21:08:34	"Freeze" is the most classic improv game.  Two players start a scene, and at some point another player freezes the scene.  The two original players freeze exactly where they are, and the third tags one of them, assumes their position exactly, and starts a completely new scene that has nothing to do with the original scene.  This has several variations.  See "Blind Freeze," "Anti-Freeze," and "Last Line Freeze."	2	6	1	1	\N
4	2013-11-10 16:04:27	2013-11-10 16:04:27	The group splits into two lines, and two members from each line face off, telling a story one word at a time.  When one of the two storytellers makes a mistake - saying more than one word or taking too long - they move to the back of their line, and the next person steps up.  Hopefully the story will continue along a general theme.	3	5	1	1	\N
5	2013-11-10 16:08:03	2013-11-10 16:08:03	Often called "3 Things" or "5 Things," this game works with a simple premise.  One member leaves the performance area, and two more members get suggestions for simple activities.  Common, easy to guess items in the activities are replaced by more suggestions, resulting in bizarre activities that the first member is then required to guess.  The activities must be explained to the first member using mime and gibberish only.  Activity suggestions include "skydiving with an elephant as a parachute."  The main variation is the number of activities taken (usually 3 or 5).	1	2	1	1	\N
6	2013-11-10 16:09:56	2013-11-10 16:09:56	Two or three players perform a normal scene.  Each line of the scene has to start with the next letter of the alphabet than the one before it.  The first line of the scene starts with a letter given by the audience.	1	1	1	1	\N
7	2013-11-10 21:52:27	2013-11-10 21:52:27	Players take turns ranting about things that really annoy them, usually suggested by the audience. How the rants flow is up to you, whether you have a host which cuts people off, or you just let people flow from one rant to another.	1	4	1	1	\N
8	2013-11-10 22:04:38	2013-11-10 22:04:38	One player leaves the room. The audience then gives the name of a celebrity, and some crazy crime that the celebrity committed. The player returns, and everyone else disperses themselves throughout the audience. The players in the audience act like members of the press, and ask questions to the celebrity about the crime committed. The questions should be phrased to allow the celebrity to guess who he is and what he did.	1	4	1	1	\N
9	2013-11-10 22:09:51	2013-11-10 22:09:51	Two random and separate audience members are interviewed about dates they've been on.  Very intricate details are recorded, and then the group shows everyone what it would be like if the two audience members dated each other.  Two group members are designated as the "couple," and the other members are supporting characters.	2	6	1	1	\N
10	2013-11-10 22:12:21	2013-11-10 22:12:21	This game works just like Freeze, with one key difference. While a scene is going on, every other member of the group is standing toward the wall, with their back to the scene. The idea is that none of the players know what is actually happening in the scene, so they will randomly freeze it whenever the audience has a big laugh.	2	6	1	1	\N
11	2013-11-11 18:04:30	2013-11-11 18:04:30	Anti Freeze works on the same principal as regular Freeze, with one major difference. Each consecutive scene takes place before the first one. This game is a pseudo long form, because the story could continue (in reverse order) through many scenes.	2	6	1	1	\N
13	2013-11-11 18:08:26	2013-11-11 18:08:26	The audience gives a slew of emotions, and someone writes them all down.  As three players do a scene, someone yells out emotions at various times.  When an emotion is called, the players continue the scene with that emotion.	1	2	1	1	\N
15	2013-11-11 18:11:34	2013-11-11 18:11:34	A rectangular area is marked off with chairs or tape, etc. Two improvisers stand at opposite ends of the area. One is blindfolded. An obstacle course of improvisers, chairs, and props is assembled in the area. The sighted improviser guides the other through the course without touching any of the obstacles. Three touches and the game is over. It is good to have a time limit on this exercise.	1	5	1	1	\N
16	2013-11-11 18:13:10	2013-11-11 18:13:10	Two players do a normal scene, with a twist.  Each player is given a secret animal (whispered into their ears), and they have to develop a character based on that animal.  They should not actually be the animal.  They should be a human inspired by the animal.	1	1	1	1	\N
17	2013-11-11 18:14:51	2013-11-11 18:14:51	One player stands in front of another player. The player in front wraps his arms around the player behind. The player behind then uses his own arms as the front player's arms. Works best in a sort of talk show environment, where the two players are some sort of expert.	1	5	1	1	\N
18	2013-11-11 18:16:16	2013-11-11 18:16:16	Two players are the hosts of a movie critic type show.  They are critiquing a new movie, which is based on the audience's suggestions.  They talk about scenes and things about the movie, and, just like a critic type show, they cut to clips of the film.  Those clips are brought to life by the rest of the group.	1	6	1	1	\N
19	2013-11-11 18:19:10	2013-11-11 18:19:10	A short scene is played. The improvisers then ask the audience if they want to see the scene that came before the scene they saw, or after. The improvisers then play that scene. Once again, the audience is asked and the third scene is played. If the audience choice leads to the improviser repeating a scene, they can add something or inform the scene with something from the earlier scene.	2	1	1	1	\N
20	2013-11-11 18:25:31	2013-11-11 18:25:31	All onstage improvisers wear blindfolds while playing the scene. They act as though they were sighted and the scene was a normal scene. For the sake of safety, the stage should be lined with spotters to make sure the onstage players do not walk off the edge of the stage.	1	1	1	1	\N
21	2013-11-11 21:42:43	2013-11-11 21:42:43	One brave audience volunteer is selected from the audience.  That volunteer is asked to tell the group about what he did that day, including as many details as possible.  The group then acts out his day as if it were a nightmare.  One player serves as the "patsy" playing as the volunteer the entire game.	1	4	1	1	\N
22	2013-11-11 21:45:36	2013-11-11 21:45:36	A regular scene takes place, except the first line and/or last line has to be a line or event given beforehand.	1	1	1	1	\N
23	2013-11-11 21:47:47	2013-11-11 21:47:47	Player 1 leaves the room, and Player 2 gets some sort of item that he would purchase from a store, as well as something wrong with the item (it doesn't work, it's made of cheese, etc).  Player 1 returns, and is a clerk working at the store where player 2 bought the broken item.  Player 2 has to get Player 1 to take back the broken item by guessing what the item is, and what's wrong with it.  Naturally, Player 2 can't actually say what the item is or what's wrong with it, because that would break the game.	1	1	1	1	\N
24	2013-11-12 15:20:11	2013-11-12 15:20:11	This game is played entirely using mime and gibberish.  Three players leave the room (or two players an an audience member).  One player remains on stage, and gets suggestions for a Location, an Occupation, and a Weapon (easily remembered as "LOW") which were involved in a murder.  Now the players each come inside one at a time, and (starting with the player on stage), convey to the next player what they think the three suggestions were.  This game works like the game "telephone" so the last player will hopefully be way off the mark.  When a player thinks he has all three things, everyone yells "Murder Murder Murder!" and he "murders" the first player.	1	8	1	1	\N
25	2013-11-12 15:23:01	2013-11-12 15:23:01	Two players leave the stage, and four more players get suggestions for an adverb, a verb, and a noun.  The term "Quickly Running Rabbits" can be used to remember what words are needed.  The two outside players return, and they debate with each other about the suggestions.  They take turns, while someone calls "switch."  The four players who know the suggestions team up and use mime and gibberish for each debater to try to get them to say the three words.  At the end, the "winner" is the first one to say all three suggestion words.  An alternative is to make it a Sermon, instead of a debate.	1	9	1	1	\N
26	2013-11-21 15:29:59	2013-11-21 15:29:59	The scene starts with two players, or three if that's your pleasure.  Everybody has someone else off-stage who is their double.  Somebody off-stage yells "switch" at various times during the scene, which causes everyone to switch with their double.  Players on stage switch with their doubles off stage (or on stage, if their double is on stage as well), and so on.  Everyone is allowed to walk into the scene, so by the end, everybody is on stage.  All of the players will have two characters in the scene (one that they created and one that their double created).  As more players are on stage, the caller calls "switch" more often, causing what looks like partially organized chaos.  By the end, the players switch roles every few words.  This seems like a very complicated game, but it is much simpler to play than it looks, making it a very entertaining experience for audiences.	1	10	1	1	\N
27	2013-11-22 09:19:39	2013-11-22 09:19:39	Two players are acting out a scene from a movie (it's a made-up movie, obviously).  The twist is that the movie is in some foreign language, taken from the audience.  Two more players sit off-stage, providing the English language "dubbing" to the foreign language spoken lines. Yes, the foreign languages are just basically gibberish, but try not to be too offensive about it.	1	7	1	1	\N
28	2013-11-22 09:28:16	2013-11-22 09:28:16	One improviser leaves the stage and the remaining improvisers get crazy traits, characters, or whatever from the audience. For example, maybe somebody only speaks in rhyme, or somebody is deathly afraid of prepositions. The offstage improviser (the "guesser") returns and starts a scene as the host of a party. Each other improviser enters one at a time and shows off their "quirk." The improviser tries to guess what everyone's deal is. When he guesses correctly they come up with a reason to leave. It works best with four people (one guesser, and three weirdos).	1	12	1	1	\N
29	2013-11-22 09:38:22	2013-11-22 09:38:22	Two improvisers take turns getting a secret about the other from the audience. Obviously the other player has to plug his ears or whatever to not hear his secret. They then do a scene and try to get the other to figure out and embody their secret. For example, person A learns that person B really hates ice cream, so A has to try to get B to refuse ice cream in the scene. It's more fun if they don't just guess what their secret is, and instead start to play as if it was always the case.	1	1	1	1	\N
30	2013-11-22 09:45:50	2013-11-22 09:45:50	Three players take turns getting a "trigger" from the audience. For example, person A might have to give person B a hug every time he agrees to something. They then do a scene. There's no guessing required, really, it's just fun to watch them figure out each other's triggers and then mess with each other. Also sometimes a scene will erupt into chaos when everybody's trigger goes off at once. You could play this with two, just like any scene, but having a three-way trigger explosion is pretty great.	1	2	1	1	\N
31	2013-11-22 09:50:15	2013-11-22 09:50:15	Basic scene exercise, meant to distill a scene down to it's most basic elements.  Three people do a scene.  Circle starts, doing some sort of action on stage.  Square enters, and initiates a relationship and some sort of conflict.  Circle counters by "raising the stakes." Finally, Triangle enters and solves the problem.  This scene takes place with only three lines.	4	2	1	1	\N
32	2013-11-22 09:51:15	2013-11-22 09:51:15	Two players sit opposite each other in chairs.  They conduct a normal conversation.  Two other players try to do whatever they can (within reason and safety) to make the two players lose their concentration.  As soon as one of the players laughs, they lose.	1	7	1	1	\N
33	2013-11-22 09:53:31	2013-11-22 09:53:31	Everybody gets in two lines. The front person in each line gets a letter of the alphabet (or two if they're brave).  Player 1 performs an action, and player 2 says, "hey, [name], what are you doing?"  Player 1 then responds with an action starting with the letter (or a two-word action starting with both letters). Then Player 2 does that action, and player 1 asks, "Hey [name], what are you doing?"  Player 2 names another activity starting with that letter.  As soon as one of them can't think of an activity, they sit down, and someone else replaces them.	1	5	1	1	\N
34	2013-11-22 09:54:53	2013-11-22 09:54:53	Players get in a line, and one stands in front as the "conductor."  Each player gets something to complain about.  The conductor conducts them just like a symphony, but instead of music, they're bitching about something.  The conductor has to try to make it sound good.	1	4	1	1	\N
35	2013-11-22 09:55:30	2013-11-22 09:55:30	The players get into a line, and one stands in front of them as the "conductor."  They get either a topic or the name of the story, and then the conductor points to one of the players.  The player he points to begins telling the story.  At some point, the conductor points to someone else, and the first person immediately stops (mid-sentence or even mid-word), and the next person immediately picks up where the first left off (mid-sentence or even mid-word).  The game can be played where if a player messes up, he or she has to sit down, and the story continues until only one player remains.	1	4	1	1	\N
36	2013-11-22 09:57:34	2013-11-22 09:57:34	Three players perform a normal scene in exactly two minutes (someone on a stopwatch makes sure the time is exact).    After that, a different set of three players performs the exact same scene, but in only one minute (obviously the scene won't be exact, but it should have all of the same elements).  The first group comes back, and does the same scene again in thirty seconds.  The second team then does the scene in fifteen seconds.  Then the first team does the scene in 7.5 seconds.  Finally, the second team returns to do the scene in 15 seconds backwards.	5	9	1	1	\N
37	2013-11-22 09:58:08	2013-11-22 09:58:08	The players get into a line and tell jokes about suggestions based on the following formula:  "I saw a movie about [suggestion] that was SO BAD!" Audience: "How bad was it?" "It was so bad, [hilarious pun based on the suggestion]!"	1	4	1	1	\N
38	2013-11-22 09:59:38	2013-11-22 09:59:38	Four players act out four scenes.  Each scene is set in a different time period (taken from the audience).  In each scene, as the scene progresses, one of the characters dies.  When that happens, the players switch to the next scene.  Once someone has died in each scene, they go back to the first scene, and directly continue it where it left off, with the dead player returning exactly where and how he died.  This continues until all four players have died in all four scenes.  The last player in each scene has to commit suicide (or accidentally die) somehow.	2	12	1	1	\N
39	2013-11-22 10:03:47	2013-11-22 10:03:47	This game works just like the show "Dating Game."  One player is the "bachelorette" and another three players are "bachelors."  Each bachelor gets some sort of ailment, either a debilitating disease, a famous person, they think they're somewhere else, or whatever.  The bachelorette asks each bachelor questions, hopefully things that will set off the bachelors' conditions.  You can play it where the bachelorette doesn't know what is going on with each bachelor, so "she" has to guess at the end. You can also have the "bachelorette" be an audience member, and then force them to actually go out with the player they choose. Another player has to be the "host" of the show, to keep it running smoothly.	2	13	1	1	\N
40	2013-11-22 10:05:17	2013-11-22 10:05:17	See "Nightmare."  You get a person's day, and then you act it out for them.  I guess the idea is that you throw in the hilarity of an improv comedy group, so it's actually interesting to re-watch the day you literally just lived. Establish one player as the person who's day you're re-enacting.	1	4	1	1	\N
41	2013-11-22 10:09:33	2013-11-22 10:06:47	One player starts this game, and three more enter the scene as walk-ons at some point. Each walk on says a line or two, and then drops dead on stage (the lines could justify why they die, but they don't have to).  The first player then continues the scene, using the "dead" players basically as puppets. Yes, it's kind of creepy, and yes it's kind of tiring for the person who is still "alive."	1	11	1	1	\N
42	2013-11-22 10:09:16	2013-11-22 10:09:16	Two players conduct an interview, with one being an interviewer, and the other being some sort of expert on a topic given by the audience.  A third player interprets the entire conversation for the hearing impaired, using a made-up sign language.	1	11	1	1	\N
43	2013-11-22 10:32:39	2013-11-22 10:32:39	This line game works just like the song "Do Run" where lyrics go, "I met a girl and her name was Jane [do run run run, a do run run].  She took the wings off of her plane [a do run run run, a do run run]. Oh, she had a mane [a huh huh] oh, she was really vane [a huh huh], she had severe back pain [a do run run run a do run run]."  Get a one syllable name or noun from the audience.  Go down the line singing verses that rhyme with that name.  The first person  just has to say the name or word ("I met a girl and her name was Jane."), and every third person has to do three in a row.  When someone fails, they are knocked out and you get a new word.  When only one player is left, that one is the "winner."  You can also do it like a rap (if you hate that song as much as I do).  Say "a-do rap rap rap" instead.	1	4	1	1	\N
44	2013-11-22 10:35:02	2013-11-22 10:35:02	Two or three players do a regular scene of a couple minutes.  Then they (or different players) do the exact same scene, but with an emotion given to them by the audience.  Do a couple replays, with different emotions.	1	5	1	1	\N
45	2013-11-22 10:37:24	2013-11-22 10:37:24	Like "Symphony" or "Bitch Concerto."  The players get in a line and each one gets an emotion (happy, sad, etc).  A "conductor" stands in front of them and conducts them like an orchestra.  Each player conveys that emotion some way that contributes to the chorus, and the conductor conducts it into a sweet song.	1	4	1	1	\N
46	2013-11-22 10:39:19	2013-11-22 10:39:19	Three zones are identified on stage (usually the left, center, and right thirds of the stage).  Each zone is labeled with an emotion.  Some people perform a normal scene, and they convey the emotion that  is identified by whichever zone they are standing in.  When the move around the stage, their emotion has to change.  The players must justify the emotion changes. I guess they don't have to justify the changes, but that's a little cheap, don't you think?	1	5	1	1	\N
47	2013-11-22 10:39:51	2013-11-22 10:39:51	Two players perform a scene.  One of the players in the scene has an "evil twin."  Someone off stage will yell "evil twin" and everyone on stage freezes.  A third player runs out, tags out the "good twin" and the scene resumes.  Then someone yells "good twin" and the good twin returns.  While the evil twin is on stage, he should try to do everything he can to make life miserable (or otherwise be "evil") to the other character (called the "patsy").  When the good twin returns, he has to justify what the evil twin did, as if both twins were one person.	1	2	1	1	\N
48	2013-11-22 10:41:06	2013-11-22 10:41:06	Like the cold, emotionless steel waiting impatiently under my coat, the pitiless cries of contempt from the audience serve only as a reminder that I am and have always been eternally damned.  I watch as a wisp of smoke flows out of my partner's mouth, the half-finished cigarette pinched between stained fingers.  I tell the audience about my pain, describing the never-ending ballet of death that is my fate, and then I realize it.  I'm not a private eye; I'm not a cop.  I'm an improv comedian, and this whole thing was just some sort of sick joke meant to entertain.  Well I don't feel entertained . . . I don't feel anything.	1	5	1	1	\N
49	2013-11-22 10:42:11	2013-11-22 10:42:11	A normal scene is started.  At some point, someone offstage can call "reverse" and the scene moves backwards.  Players don't have to actually talk backwards, just say sentences in reverse order.  The caller can then call "forward" and the scene continues, repeating whatever they just did backwards.  The caller can call forward and reverse at any time, and the scene can even go back in time to before the scene started. Works best if everybody is as active as possible.	1	5	1	1	\N
50	2013-11-22 10:43:15	2013-11-22 10:43:15	One player sits in a chair, and everyone else lines up.  The players go through the line, trying to make the player get up so that they can take the seat.  You can't touch the sitting player; you have to say something or do something that would make sense.	1	5	1	1	\N
51	2013-11-22 10:47:38	2013-11-22 10:47:38	Called "GABAWA" for short, this game works like a talk show.  Three players stand on stage, and each one gets some sort of character from the audience (a historical figure, someone you're afraid of, etc).  The audience asks questions, and the players answer them.  The first player gives good advice, the second player gives bad advice, and the third player gives the worst advice.  This is a game of "one-upping" the other players.  Give advice that would make sense as your character.	1	2	1	1	\N
52	2013-11-22 10:48:58	2013-11-22 10:48:58	Four people tell a story.  This isn't meant to be funny, but it usually ends up being a lot of fun.  Get some sort of event from the audience, and then tell the story like the four of you were there.  Let it happen, collaborate, and enjoy it. This makes for a good set up for longform.	1	12	1	1	\N
53	2013-11-22 10:49:48	2013-11-22 10:49:48	One player leaves the area.  Two players remain.  The audience supplies a famous person, and some ridiculous crime that was committed to the famous person.  The outside player returns; he is the one who committed the crime (which he doesn't know about).  The two other players interrogate him, giving him clues about who he is and what he did.  The player being interrogated has to figure out what he did and to whom.	1	2	1	1	\N
54	2013-11-22 10:50:57	2013-11-22 10:50:57	One player goes outside.  The rest of the players get a suggestion for an historical event.  Each player then gets assigned a famous person from that historical event.  The outside player comes back in,  and everyone on stage performs an interpretive dance for that player, acting out the famous event as the people they are supposed to be.  The player watching then has to guess what the event is and who everybody is supposed to be.  You can also play it where an audience member has to guess what is going on, or do two versions, one for a an audience member, and then one for a player (with the Audience Member included in the second dance).	1	4	1	1	\N
55	2013-11-22 10:52:02	2013-11-22 10:52:02	Players do a regular, ~2 minute scene.  Then they redo the scene (exactly as it was), except styled like various film genres given from the audience. See also "Emotion Replay" or "Countdown."	2	5	1	1	\N
56	2013-11-22 10:53:28	2013-11-22 10:53:28	Players do a regular scene. They break into song, just like in a musical. It works best if you have some sort of musical accomp - acomp - acump . . . somebody who can play music to back you up.	1	5	1	1	\N
57	2013-11-22 10:54:18	2013-11-22 10:54:18	Two people do a normal scene. The twist is that they can only ask questions. You can make it more interesting with a "knockout" feature. If a player fails to ask a question, they are "out" and they switch with someone off-stage. The scene then continues until someone fails to ask a question.	1	5	1	1	\N
58	2013-11-22 10:55:09	2013-11-22 10:55:09	Three players stand in a line. The center player is the "leader." The other two players should try to mimic the center player's stance and actions as closely as possible. The audience asks simple (or not so simple) questions, either on a topic, or just general advice questions. The three "professors" answer the questions, each saying one word at a time. Make sure you make logical sentences and try your best to answer the questions.	1	2	1	1	\N
59	2013-11-22 10:57:05	2013-11-22 10:57:05	The players stand in a circle, and one by one, each player goes around the entire circle, facing each player. When the center person faces you, you yell a syllable (any syllable or sound) and the player in the middle yells another syllable. Everyone puts them together into a word, and then the player in the center moves to the next player. It helps to add a "do-do-do" after everybody repeats the word to keep a rhythm going. For example, person A goes to person B. Person B yells "Sand" and then person A yells "Which." Everybody yells "SANDWICH (do-do-do)!" and A moves on to the next person in the circle.	2	4	1	1	\N
60	2013-11-22 10:57:59	2013-11-22 10:57:59	This is a classic warmup game. Players stand in a circle and one player gets into the center. The center player picks someone, and yells "Bippity Bippity Bop" at him. The player being yelled at has to say "Bop!" before the center player, or he has to go into the center. Also, the center player can yell things like, "Eskimos" and then count to ten really fast. The player being yelled at must work with the people standing next to him to be Eskimos before the yeller gets to ten. Watch out, though, because if the player in the center yells, "Miggity Miggity Mack!" the player being yelled at should say absolutely nothing, or he goes into the center!	2	4	1	1	\N
61	2013-11-22 10:59:18	2013-11-22 10:59:18	Players do a normal scene. However, each one gets a number (between 0 and 12 or so), and can only say that many words at a time. Every time each person speaks in the scene, they have to use exactly that many words.	1	5	1	1	\N
3	2014-12-01 19:11:20.184	2014-12-01 19:11:20.184	Two players start a totally regular scene. However, at any point during the scene, after a player says a line (or does an action), somebody off-stage can ring a bell (or yell "ding" or "new choice" or whatever you feel like). The player who just said (or did) the thing then says a new thing. The scene continues as if the player had said that the whole time.\n\nFor example, Player A says, "Hey, you sure are late to this meeting."\n\nPlayer B responds, "I had to tie my shoes - (DING) I had to catch the bus - (DING) A dinosaur attacked me (DING) My rocket ship ran out of plutonium."\n\nPlayer A might then say, "well I told you to stop at the plutonium station on your way back to your orbital station last hyper-cycle!"	1	11	1	1	\N
70	2014-12-01 22:30:09.836	2014-12-01 22:30:09.836	Two audience members are interviewed and we establish a handful of facts about their interests, friends, or whatever. Then two players play a scene as the audience members (using the information provided by the audience members) meeting each other for the first time. After a few moments, we jump forward a given period of time to see how their relationship has progressed. We see a few of these time jumps. Try to not just make fun of them, please.	2	5	1	1	\N
62	2014-12-01 21:29:13.184	2014-12-01 21:29:13.184	In this game, three players are putting on a scene. However, during the scene, one of the players must be sitting, another standing, and the last lying down. They can (and should) switch positions throughout the scene, and then justify why such things are happening.	1	2	1	1	\N
64	2014-12-01 21:37:21.962	2014-12-01 21:37:21.962	Two (or whatever) players do a normal scene. However, as the scene progresses, a caller (or the audience, whatever) yells out different TV, Movie, or Whatever genres. The scene then continues as that genre.	1	11	1	1	\N
65	2014-12-01 21:42:33.379	2014-12-01 21:42:33.379	In this warmup game, the players form a circle and choose one player to be "it." The "it" player then confronts the players in the circle and yells "WHERE ARE YOUR PAPERS" in the best German Accent they can muster. The confronted player responds with "ZEY ARE IN MY ATACHÃ©." Meanwhile, as the "it" player is distracted with this daunting task, players behind his back should be making eye contact with other players in the circle. When eye contact is made, the two players should immediately switch places with each other. If the "it" player notices this happening and steals one of the moving players' positions, the player stuck in the middle is now "it."	3	14	1	1	\N
66	2014-12-01 21:53:47.919	2014-12-01 21:53:47.919	Two pairs of players are in this game. The first pair starts a normal scene, but throughout it they say stuff like "I wonder what so-and-so is up to" or "I wonder what happened to those drunk dudes after we left the bar" or "I wonder if I could beat you in a fight." The first pair then switches with the second, who then shows what the first pair was wondering about.	1	7	1	1	\N
67	2014-12-01 22:03:30.716	2014-12-01 22:03:30.716	Two players start a normal scene. However, throughout the scene, a third player on the sidelines narrates what one of the players on stage is thinking. For example, a player on stage might ask "how does this dress look?" The other player might respond, "oh, that's nice." Then the player offstage might say, "that is the most unflattering dress I've ever seen." For more fun, show the inner thoughts of both players on stage!	1	11	1	1	\N
68	2014-12-01 22:21:29.388	2014-12-01 22:21:29.388	A player gets a strange name (Four-finger Pete, Big Greg, Yellow Shirt Guy, whatever). They then have to develop a character based on the name. After a few minutes, hopefully after establishing as much as possible about this strange character, the player gets a new name and creates an entirely new character. Try also throwing the player into the context of simple, every day settings to give them something to work with.	1	4	1	1	\N
69	2014-12-01 22:26:04.641	2014-12-01 22:26:04.641	Two players begin a scene stranded at some given location. They discuss details of how they were stranded, providing clues and tidbits to draw from, such as "I can't believe so-and-so attacked us," or "I don't even remember how you lost your foot." After a few moments of establishing their desperate situation, they start anew, back in time to before whatever happened happened. We then get to see the whatever happening. Other players can enter to provide additional support to the chaos.	2	5	1	1	\N
71	2014-12-01 22:33:25.986	2014-12-01 22:33:25.986	One player sits in a chair, "watching TV." The other players reinact what the first player is watching. The "watcher" can yell "CLICK" or whatever to change the channel, and the players have to change to a completely different thing. Players can switch out on "screen" to vary the programming. You can play "elimination" style by kicking players off stage if they hesitate to provide something on a new channel immediately.	2	4	1	1	\N
72	2014-12-01 22:40:32.211	2014-12-01 22:40:32.211	Three players stand on stage to debate a given topic for a set time limit (usually like 90 seconds). A fourth player moderates the debate and watches the clock. One debater speaks at a time about the topic, and the others can at any time yell "challenge!" The time is paused and the challenger is allowed to explain why the speaker screwed up. If the moderator (and / or audience) deems the challenge valid, the challenger steps up and continues the debate. Whichever debater is speaking when the time runs out wins! They are the master debat - oh, nevermind.	4	15	1	1	\N
73	2014-12-01 22:46:41.139	2014-12-01 22:46:41.139	Two players play this game, a doctor and a patient. First the patient leaves the room and the doctor gets an illness and method of contraction from the audience. The zanier (and less like an actual illness) the better. Then the patient returns and the doctor leaves. The patient gets the cure for the illness and what side-effects it has (hopefully without the audience giving away the illness). The doctor returns, and they conduct a doctor-patient scene (which is apropos since they're a doctor and a patient). The patient first tries to guess their illness and how they got it. Then the doctor has to guess how it's cured and what the side-effects are. For added excitement, time each player and announce how long it took them after they succeed so we can see who is the better guesser or whatever.	2	1	1	1	\N
74	2014-12-01 22:49:37.72	2014-12-01 22:49:37.72	A player starts a scene by getting a phrase from the audience (or other group members, since this is more of an exercise). The player then can only interact in the scene by using that phrase. Try coming up with a few different characters to justify the phrase.	1	4	1	1	\N
75	2014-12-01 22:55:04.813	2014-12-01 22:55:04.813	Each player takes turns telling a small part of a story, the title of which is given by the audience. The trick is that a player doesn't have to tell the chronologically next piece of the story on each turn. On his or her turn, a player stands somewhere along a line across the stage, generally indicating the position of their part of the story. When each player steps forward, the players already in place tell the entire story so the new player can include his or her piece in order. As each player comes out, the story slowly starts to come together and (hopefully) makes more sense. When a player stands between two others, their piece should theoretically or to some extent connect the adjacent parts together.	3	4	1	1	\N
76	2014-12-02 10:07:29.411	2014-12-02 10:07:29.411	Two players stand at the front of the stage as "presenters" (it can be just one player I guess if you're strapped for people). The presenters introduce themselves (as zany characters) and prepare the audience for a slideshow of photos from their recent vacation. The presenters' vacation destination and a famous person they met on their trip are taken as suggestions from the audience. Now the presenters show their slides, which are presented by the rest of the group forming a tableau on stage. The presenters proceed to narrate what is happening in each picture. The presenters should remember to tell the story of how they met the given celebrity. It helps to have control of lighting so the presenters can turn the lights off and on to signify the changing of  the slides.	1	6	1	1	\N
77	2014-12-02 10:14:01.323	2014-12-02 10:14:01.323	Three players start a scene in a car, sitting in four chairs arranged like the front and back seats. Soon a fourth player enters as a hitchhiker, and the car pulls over to pick them up. The hitchhiker takes on a wild and crazy character trait which the other people in the car should adapt and heighten. After all four players have fully embraced this character trait and had some fun with it, the driver of the car leaves and everybody moves up one seat (the passenger becomes the driver, the guy in the back seat moves to the front, and the hitchhiker moves over). Another player then arrives as another hitchhiker, with a different character trait, and the process is repeated. This process continues until everybody has had a chance to come up with a character (the initial three people in the car should go to the back of the line - they will be the last three players to come up with a character).	2	4	1	1	\N
78	2014-12-02 10:21:40.084	2014-12-02 10:21:40.084	One player (the "employee") leaves the room, leaving four players on stage (a "boss" in a chair and three "co-workers" behind his back). These four players get three "excuses" from the audience - the way the employee tried getting to work, something that happened causing that way to fail, and another event that allowed the employee to get to work after all. The employee then returns, excusing himself for being late. The "boss" yells at the employee for being late, and the other three "co-workers" silently act out the excuses to the employee behind the boss's back. The employee must guess the three excuses by interpreting the co-workers.	2	13	1	1	\N
79	2014-12-02 10:24:45.801	2014-12-02 10:24:45.801	Four players each get a word from the audience. They then play a scene, and any time their word is said they have to either enter or exit the scene (depending on if they were already in it or not). All four players don't have to start the scene on-stage.	1	12	1	1	\N
80	2014-12-02 10:32:01.7	2014-12-02 10:32:01.7	Five players play in this scene, but only one starts it. The first player starts a simple one-person scene based on the audience suggestion. When the second person enters, they start an entirely new scene with the two of them. This continues with the rest of the players, starting an entirely new scene with each entrance. After a few moments of all five players on  stage, the fifth leaves the scene (with a proper justification, of course), and we return to the same four person scene that was started earlier. The fourth player leaves, returning us to the three person scene, and so forth until we are back to the first player, who finishes his solo scene.	2	13	1	1	\N
81	2014-12-02 10:37:52.621	2014-12-02 10:37:52.621	This game is played like a goofy infomercial, with a cheesy host introducing each player. The players enter one at a time as inventors to show off their amazing new inventions. Before the game starts, the host gets a handful of nouns, verbs, and international locations. The host then uses those suggestions to introduce the three inventors as being from [LOCATION], and having invented the [NOUN] [VERB]er. For example, if some suggestions were "Plastic," "Wipe," and "Austrailia," the host would say "our next guest is from Australia, and he invented the 'Plastic Wiper!'" The inventor then takes a few minutes to talk to the host about themselves and demonstrate their invention and what it does (don't forget to tell everybody where they can buy it and how much it costs!). The host then says goodbye to the inventor and rouses the audience to all say along with him, "WHAT WILL THEY THINK OF NEXT?!"	2	12	1	1	\N
82	2014-12-02 11:18:27.773	2014-12-02 11:18:27.773	Two or three players do a normal scene, with a twist. Before the scene, collect a bunch of slips of paper and have the audience write phrases on them - movie quotes, things they heard, lines from books, poetry, whatever. Randomly throughout the scene, the players can pull these slips of paper out of their pockets and read the lines aloud, as if they had just said them. They then have to justify why they say such wacky things.	2	1	1	1	\N
83	2014-12-02 11:23:42.421	2014-12-02 11:23:42.421	First, get some sort of crisis from the audience (we ran out of somebody's favorite food, maybe). Then you get a super hero name from the audience, and a player starts as that hero, trying to figure out how to solve the crisis. A second player enters, and the first calls him or her by name, thereby establishing the new hero's identity. The new hero embodies the name they were given and tries to help the first with the crisis. This continues likewise as two other heroes enter, the second naming the third and the third naming the fourth. As a solution is determined, the heroes exit one by one, in the order they arrived (the first hero exits first, etcetera).	2	12	1	1	\N
84	2014-12-02 11:28:29.236	2014-12-02 11:28:29.236	The players establish a bathroom, one by one. On his or her turn, each player enters a completely imaginary bathroom, completes some action (washing his face, combing his hair, taking a shower, brushing his teeth, etcetera), and then leaves the room. The next player then enters, completely replicates everything that has been done already, and adds another action to the end. By the last player, hopefully a very detailed and well-established bathroom has been created.	2	4	1	1	\N
85	2014-12-02 11:31:48.426	2014-12-02 11:31:48.426	The players form a line and take suggestions for things (literally anything) from the audience. They then take turns showing examples of the worst possible one of those things. For example, if a suggestion was "Breakfast Cereal," a player might step forward and mime eating from a bowl while saying, "mmm, glass!" Once a few things have been done with a suggestion, take a new one.	1	4	1	1	\N
86	2014-12-02 11:41:12.769	2014-12-02 11:41:12.769	Four players stand in a square, with two players upstage and two downstage. A caller sits nearby and can rotate the square by calling "left" and "right" thereby making a different pair of players the ones in front. Go through a full rotation of the square, getting a suggestion from the audience for each pair (there should be four). Now begin a scene with the front pair. At any point the caller can rotate the square, and whichever pair of players is in front plays their scene. Each player is therefore in two different scenes.	2	16	1	1	\N
87	2014-12-02 14:31:10.212	2014-12-02 14:31:10.212	This game is an exciting televised sporting competition - well, sort of. You start by getting a mundane, every day activity. That activity is now the cut-throat sport being played in this high-stakes match. Two players act as commentators (to be true to sporting events, one commentator should be a play-by-play announcer and the other should provide color commentary). Another two players are the athletes, competing in a world championship of whatever mundane activity you got. The athletes should operate entirely in slow motion, being careful to match their speeds by shaking hands to start the match. As the match goes on, the mundane, "boring" activity will become much more "full contact" and violent, until basically one of the competitors is physically unable to finish the match, or one of the players is disqualified for doing some ridiculous thing. Feel free to have a ref enter at some point (also in slow motion) to manage things. Also feel free (as the commentators) to pause the action, show replays, zoom in, or otherwise call the shots. 	2	7	1	1	\N
90	2014-12-04 09:52:21.046	2014-12-04 09:52:21.046	The players stand on stage in a line, and get a series of suggestions for basically anything from the audience. Then players take turns stepping forward and giving their best action movie catch phrase (if there was an action movie based on the suggestion). For example, if the suggestion was "hot dog" a player might say "Sorry to be so frank!" Bring out your best Arnold Schwarzenegger impersonations!	1	4	1	1	\N
91	2014-12-14 18:28:46.179	2014-12-14 18:28:46.179	Two pairs of players (that's two teams of two) take turns using props in different, perhaps surprising ways. Each team gets a different prop, and they should be something strange and unrecognizable (but big enough to be seen by the audience). When demonstrating the prop, the players should keep it short, just giving a single line while holding the prop. For example, if the prop were a large cone-shaped object, a player could step forward and hold it in front of their mouth, shouting "go team!" Just watch Whose Line, they do this game all the time.	1	7	1	1	\N
92	2014-12-14 18:36:45.763	2014-12-14 18:36:45.763	Everybody gets in a big, old circle, and then everybody holds up all ten of their fingers (or however many they have - I don't want to be offensive to anybody with missing fingers). Now take turns asking random yes or no questions to the group. Each person gets to ask one question, in whatever order you want. How do you determine who gets to ask a question? I don't know, man, just start somewhere and go around the circle. I'm not the boss of your circle. When you can't (that's CAN NOT) answer "yes" to a question, you drop a finger. The last person with a finger still up wins! What do they win? The ability to flip everybody off, I guess.	1	4	1	1	\N
102	2014-12-15 18:17:25.588	2014-12-15 18:17:25.588	The players form a circle. That is, the players stand in a circle. That is, the players stand around in a circular pattern, all facing inward. Just get in a circle. Now go around the circle and introduce yourself. You have two options, which are as follows: say your name and a word that rhymes with your name ("Karin Starin'"), or say a word that alliterates with your name ("Calamity Karen"). You can also throw a gesture in there too, knock yourself out. Each consecutive person around the circle then repeats the name, alliteration / rhyme, and action of everybody who was before them, and adds their name and whatever to the end. Yes, the last poor sap in the circle has to do everybody.	3	4	1	1	\N
104	2014-12-16 09:56:59.76	2014-12-16 09:56:59.76	It has "Circle" in the name, so you should know what to do (hint: get in a circle). One player starts by pointing at somebody and saying the letter 'A' at him. That player then points to somebody else, and says 'B.' It continues like this, passing letters around, for the entire alphabet. Do it as fast as you can!	1	4	1	1	\N
105	2014-12-16 10:05:40.225	2014-12-16 10:05:40.225	Everybody wanders about the space, just aimlessly milling about. Eventually, everybody should pick somebody at random to be their 'enemy.' Without saying anything to your enemy, keep milling about the space but constantly work to keep your enemy on the other side of the space - stay as far away from that jerk as possible. Now everybody should pick somebody else to be their 'friend.' Keep wandering around, but now work to keep your friend between you and your enemy. Chaos ensues, but in a sort of controlled, interesting way.	4	4	1	1	\N
120	2014-12-17 15:15:56.002	2014-12-17 15:15:56.002	Two or three players start doing a regular scene, each wearing a different hat. At some point a caller will freeze the scene and switch the hats around. Then the scene continues, with each player continuing as the character who last wore the hat. They should justify why they switched around. Try not to make it some weird sci-fi teleportation thing.	1	11	1	1	\N
93	2014-12-14 18:45:58.67	2014-12-14 18:45:58.67	<p>Everybody gets in a big old circle. Starting somewhere, a player points to another player and says basically any word. That person (the person who just got pointed at) points at somebody else and says another word, hopefully following in some sort of pattern to what was said first. This continues until everybody has been pointed at and everybody has a word. As an example, if the first person said, "bologna," the following words could be "ham," "roast beef," or "turkey," thereby following the pattern, "types of deli meats." Anyway, go over your pattern a few times, making sure everybody remembers their word, and the word preceding them.</p>\n\n<p>Now things get interesting. Let the first pattern go (for now), and do another one. Take turns pointing and saying a thing (pick a different thing and a different person to point at this time), creating a new pattern. After you go over the second pattern a couple times, and while the second pattern is still going, start the first pattern again. See how long and how fast you can keep both patterns going at the same time without either dropping one or randomly having two of the same pattern at once (it happens).</p>\n\n<p>Once you get the hang of two, start a third!</p>\n\n<p>It's usually good to start with everybody's name for the first pattern, so as to serve as a sort of icebreaker for everybody.</p>	2	4	1	1	\N
94	2014-12-14 18:54:16.157	2014-12-14 18:54:16.157	<p>Somebody starts (which really is the case for basically anything that ever happens, I guess), stepping forward and declaring that they are a thing, for example "I am a piece of cheese." Another person joins them and claims to be a complimentary item, for example "I am a piece of bread." Finally, a third person enters and further compliments both existing items, saying something like, "I am a slice of bologna."</p>\n\n<p>Two of the people leave (oh, let's just say the first two), and the remaining person declares their identity again, "I am a slice of bologna." Two other people enter and form a new triad around that thing, perhaps, "I am a slice of ham," and "I am a pimento." Keep doing that for a while, until you get bored or something.</p>	1	4	1	1	\N
95	2014-12-14 18:58:47.046	2014-12-14 18:58:47.046	First, everybody should get all up in a circle. Now somebody turns to their left and faces that person. The first person then does some sort of action (preferrably with a sound effect). The second person then turns to the next and PERFECTLY repeats the action and sound. The second person likewise turns to the next and EXACTLY replicates the action they just saw. The goal here is to try to be as exact and precise (and other synonyms) as possible, so each time the action is done it is exactly the same. Obviously, however, that won't be the case, as everybody adds their own oddities (either intentionally or unintentionally) to the mix. Just focus on repeating the action you just saw, dis-ir-regardless of what has come before. By the end, the action will have mutated into something beautiful.	1	4	1	1	\N
96	2014-12-14 19:04:53.958	2014-12-14 19:04:53.958	Everybody gathers into a circle. After the inevitable rearranging of the circle because at first it was more of a football shape or whatever, somebody starts by saying their name. As the person says their name, they do some sort of action (it can be anything, either miming a real action or just moving your arms in a weird way). Now everybody replicates the name and action in one of the following two ways: the entire group repeats the name and action together, and you move on to the next person, or the next person repeats every name-action that has come before, adding his or her new contribution to the end. For even more fun (if you can call it that), have each syllable of everybody's name come with an action, so the name "Alyson" would have three actions along with it ("Al," "ih," and "son").	1	4	1	1	\N
97	2014-12-15 17:36:58.735	2014-12-15 17:36:58.735	Two players start a regular old scene. At some point, however, the scene freezes (maybe somebody offstage calls it, or whatever, you can figure that out), and two different actors replace the ones in the scene. The scene continues with the exact same characters and the exact same situation, just with two different actors. You can keep switching them out occasionally until you get bored or the scene comes to a close or whatever.	1	5	1	1	\N
98	2014-12-15 17:46:18.258	2014-12-15 17:46:18.258	A player starts a solo scene, or two players can start a scene together. At some point, usually after doing some sort of action, someone offstage can ring a bell or clap their hands. When this happens (the ring or the clap), the player has to commit to performing the action they were doing in the absolute most serious, exciting, or interesting way possible. Even if it's something as simple as walking across the stage, they have to walk the house down. This single, specific action continues, without changing to anything else (in other words, if the action is picking something off a shelf, that's the action - you can't go to holding the object or using it). Someone offstage can then  clap or ring that bell again and the scene can continue. Use this to see just how crazy you can make a single, simple action.	1	17	1	1	\N
99	2014-12-15 17:48:58.081	2014-12-15 17:48:58.081	Players do a normal scene, but before they start they get three rules from the audience. The rules can be something like "must be holding hands at all times," or "can't use pronouns," or "must be in some way talking to or about a cat." The players then must obey the rules throughout the scene.	1	1	1	1	\N
100	2014-12-15 17:56:09.757	2014-12-15 17:56:09.757	Get in one of them circles. The entire group then establishes a rhythm by chanting "Ali Baba and the Forty Thieves" over and over, at a nice steady pace. At some point, the starting person (pick somebody to go first, it doesn't matter) does some action to the beat, like wagging their finger with the words or something. As soon as the next chant begins, the next person repeats the action of the first, and the first person does a new, different action. Upon the third chanting of the thing, the third person repeats the first action, the second person repeats the second action, and the first person does another new, different action. This continues for a while, each player always repeating the action performed by their preceding neighbor on each consecutive chant. Try not to pay attention to the group, just focus on the person next to you for your next action and keep the rhythm going.	4	4	1	1	\N
101	2014-12-15 17:59:31.675	2014-12-15 17:59:31.675	Everybody gathers into a circular type arrangement (in that they get into a circle, which is about as circular as you can get). On the count of three, everybody either takes the form of an Alien, a Tiger, or a Cow. The Alien holds two fingers up like antennas and says "beep beep." The Tiger holds up her left hand like a tiger paw and says, "rawr rawr." The Cow holds his right hand to his belly, bending forward, and says "moooo." The goal is for everybody in the circular type arrangement to be the same thing all at once. Keep trying a few times, counting to three, until you're all on the same page.	4	4	1	1	\N
103	2014-12-15 18:23:32.668	2014-12-15 18:23:32.668	Circle up, or down, or whatever direction you want to circle (which is usually laterally unless you are playing this in space or while rock climbing or something). Get a ball and pass it to somebody in the circle. Start passing the ball around the circle, and the person who started has to try saying every word he or she can think of that starts with a given letter. There are no winners or losers, you're just trying to get your mind grapes churning.	4	4	1	1	\N
106	2014-12-16 10:11:35.872	2014-12-16 10:11:35.872	The players should randomly and absently walk about the space. At any moment, a coach or caller, or whatever (it could even just be a cellphone programmed to beep at given intervals or something) signals the group. Just reacting to the "energy of the space" the group forms a tableau. Someone should naturally be the focal point of the tableau, and the others will be supporting him or her. This is a good exercise for getting a feel for "fulfilling your role" - that is, taking on the position the group needs, not the one that you think is fun or will get you attention. Be the hero the team needs, not the one they deserve - or something like that.	3	4	1	1	\N
107	2014-12-16 10:17:09.56	2014-12-16 10:17:09.56	Two or three players start a scene from a simple suggestion. At some point, another player yells "cut!" and enters to give the players wacky direction. The players then continue the scene with the new direction. For example, the director might tell one of the players that their character is missing an arm, so they have to be without an arm for the rest of the scene, or maybe somebody is directed to speak with an accent or something. The director can also turn to the audience for help, prompting for a suggestion by saying something like "this character isn't an American, everybody knows he's actually from . . . where?" Feel free, as the director, to play the director character, being pretentious and insulting or whatever you think would be fun.	1	11	1	1	\N
108	2014-12-16 10:26:17.946	2014-12-16 10:26:17.946	Half the group leaves the space. The other half then plans this hilarious prank on them for when they return (well, it's just a fun example, not a hilarious prank). When the outside group returns, the inside group will explain that they came up with a great story, which the outside group will have to guess by only asking 'yes or no' questions. The inside group didn't come up with any story, of course, and will simply answer 'yes' or 'no' based on some random criteria which they will establish. For example, respond 'yes' to any question that starts with a vowel, or any question with the verb "go" in it, or always say 'yes' after you have said 'no' twice in a row. The outside group returns and everybody splits up so one outsider is paired with one insider, and they come up with a story together. The idea is that this will prove how easy it is to invent a story on the spot, because the person asking the questions is coming up with everything right there. You probably can only play once because then everybody is in on the gimmick.	2	4	1	1	\N
109	2014-12-16 10:31:53.955	2014-12-16 10:31:53.955	This is just like Genre Replay, Emotional Replay, or any other Replay games that work like that. Two players do a normal, quick scene without any real gimmicks. Then they re-play the scene in a series of different time periods, taken from the audience.	2	1	1	1	\N
110	2014-12-16 10:36:42.314	2014-12-16 10:36:42.314	This game works just like Genre Replay, Emotional Replay, or any other Replay style game. Two players do a normal, quick scene. Then two different players do the exact same scene. Choose strong characters, because the fun of this game is in watching other actors trying to replicate each other.	2	6	1	1	\N
111	2014-12-16 10:41:28.213	2014-12-16 10:41:28.213	Two players conduct an interview, talk-show style, about a topic they get from the audience. The gimmick is that the entire conversation happens backwards, starting with the last line "Well, I hate to cut you off there, but that's all the time we have," and then the line before that, and so on. You can play with forcing the other player into certain situations by reacting in certain ways. For example, the interviewer could say, "woah, calm down, this doesn't need to be heated." The person being interviewed then has to get really outraged about something, obviously.	1	1	1	1	\N
112	2014-12-16 10:45:17.345	2014-12-16 10:45:17.345	One player sings a made up ballad about an audience suggestion. The other players act out the content of the song on stage, in slow motion.	1	11	1	1	\N
113	2014-12-16 11:00:00.641	2014-12-16 11:00:00.641	The players generally mill about the space. One player is "it" and can tag other players. When tagged, a player has to hold his or her hand over the tagged spot, like a bandage. When you get tagged a third time (and you have no more "bandages" to spare), you have to freeze in place. Two other players can unfreeze you by both tagging you at the same time and counting to five.	3	4	1	1	\N
114	2014-12-16 11:14:14.014	2014-12-16 11:14:14.014	The players assume the form of a circle (they stand around in a circle). Somebody gets into the middle of the circle and randomly picks a player, pointing at them and giving them a letter of the alphabet. That player then has to come up with a person, an object, and a location that all start with the letter, and yells, "[Person] sells [Object] in [Location]!" For example, if the letter was 'M,' the person could yell "Mike sells Mattresses in Montana!" If they fail to come up with the words, or they don't use the right letter, they replace the person in the middle.	4	4	1	1	\N
115	2014-12-17 11:31:43.504	2014-12-17 11:31:43.504	Each player is given a farm animal (well, they're assigned the name of a farm animal, you aren't handing out like cows and sheep to everybody). Each animal should be given out, in secret, to a few players throughout the group. Once everyone is ready, the players begin wandering about, and without saying any English words, acting as and sounding like their animal. The players should try to find the other players with their animal. The first group to find all of their people and sit down wins! What do they win? Nothing really!	3	14	1	1	\N
116	2014-12-17 11:38:49.237	2014-12-17 11:38:49.237	One player ("it") stands against a wall (no, you aren't in trouble). The other players stand against the opposite wall. Their goal is to get across the room to "it" without "it" seeing them move (my goal is to stop referring to people as "it"). "It" can turn around at any time and look at the players, and if "it" sees any of them moving, they're out. If "it" turns around, you have to freeze.	3	4	1	1	\N
117	2014-12-17 12:10:26.709	2014-12-17 12:10:26.709	All of the players form a line. They make up a rap about a given topic, each player taking turns rapping the next line. The entire group should say the last word of each line with the player whose turn it is. Listen to basically any Beasty Boys track, because they're awesome (also they'll show how this game should sound I guess).	3	4	1	1	\N
118	2014-12-17 12:15:33.474	2014-12-17 12:15:33.474	Announce to the audience that you will now be taking a break from comedy to perform some poetry that some of the group members have written. Get two unrelated suggestions from the audience, and the "poets" (perhaps that word should always be in quotes) have to make up poems about the two suggestions. If the poem fails to incorporate both suggestions or doesn't rhyme (because all good poetry rhymes), the "poet" is shunned by the art community and forced to get a job at a corporate bakery selling cupcakes - I mean, they mime committing suicide on stage.	2	4	1	1	\N
119	2014-12-17 12:18:37.205	2014-12-17 12:18:37.205	The players (or perhaps one player at a time) attempts to "become" a random object given by either a coach or other players (like maybe a sandwich, or a hot dog, or a bag of chips - sorry, it's lunch time). Think about the details of the thing you are trying to be. Embody the thing as much as possible.	2	4	1	1	\N
121	2014-12-17 15:35:11.459	2014-12-17 15:35:11.459	The players get into a circle. Somebody starts as "Big Booty" and then the players count off clockwise, "Number 1," "Number 2," etcetera. Now the players all establish a simple rhythm by clapping or tapping their thighs or whatever. Big Booty starts the game by initiating following chant (everybody should join in): "Aaaawwww Big Booty, Big Booty, Big Booty. Big Booty, uh-huh!" This gets everybody on the same rhythm. Big Booty then sends the "energy" to a player by saying "Big Booty, Number X" on the beat. That player passes it to anther ("Number X, Number X"). The players continue to pass the energy around with the beat (remember you can always say "Number X, Big Booty" too) until somebody misses the beat or otherwise screws up. When a player "goofs," they move to the end of the circle and they are now the highest number, while every player that was higher than them moves one number down, and Big Booty starts it again.	3	4	1	1	\N
122	2014-12-17 16:26:38.91	2014-12-17 16:26:38.91	The players all go into circle mode - that's where everybody stands in a circle, but with a cool name so it seems more fun. Now starting with somebody, the players pass a "fish" around from one player to the player next to them. When you get the "fish" you can do one of two things. Saying "Big Fish" while holding your hands in front of you a few inches apart will pass the "fish" to the next player. Saying "Small Fish" while holding your hands in front of you 20 or so inches apart will change the direction of the fish, and send it back the way it came. Remember, for "Big Fish" you show a small gap between your hands, and for "Small Fish" you show a large one. Go figure. You can play it with elimination by removing the players that mix up the direction or the size of the fish.	3	4	1	1	\N
123	2014-12-18 21:46:05.046	2014-12-18 21:46:05.046	In this exercise, all of the players get in a line or a circle or whatever, and everybody gets a number. A coach or ref or leader or custom phone app randomly picks two numbers. The players with those numbers step forward, and both immediately "offer" an action and a statement of some sort. For example somebody could step forward, mime slicing some bread, and say "I'm worried about taxes this year." The players have to take a few moments to figure out how their actions and lines are related, and what their scene is about.	2	4	1	1	\N
124	2014-12-18 21:57:57.806	2014-12-18 21:57:57.806	Begin by having everybody wander about the space. Then everybody is to line up in order based on some criteria you can make up on the spot. The criteria can range from light, simple stuff like height and hair length to (potentially made up) personal stuff like number of exes or number of times arrested to more etherial and philosophical stuff like style or freedom.	3	4	1	1	\N
125	2014-12-18 22:15:57.705	2014-12-18 22:15:57.705	<p>Players should get into a line (well, I don't want to sound pushy - you can get into a line if you want to). The first player is "on deck." The rest of the players take turns stepping to the "on deck" player and initiating a scene with them. In other words, the next player in line approaches the "deck" and offers one line. The player "on deck" responds with a single line, and hopefully we have the start of a totally awesome scene. The initiating player goes to the back of the line, and the next player in line approaches the "on deck" player. When everybody has gone, it's the next player's turn to be "on deck." This exercise is great for getting the hang of initiating scenes.</p>\n\n<p>An alternative approach would be to have two lines, and the first player in each line starts a scene with one another, then they go to the back of the line.</p>\n\n<p>You can add a bit of challenge by requiring that the two line scenes must be something the rest of the group wants to see more of. If two players initiate a scene that doesn't seem interesting enough, they must keep trying until they interest the group.</p>	2	4	1	1	\N
126	2014-12-18 22:19:36.308	2014-12-18 22:19:36.308	Four players have to try to hide a fifth using only their bodies. I mean, you don't have to get naked, you just can't use props or scenery or whatever. The rest of the group has to try to look for ways to find the hidden player (scraps of clothing sticking out, feet visible, or whathaveyou). Try it with fewer and fewer "hiders" until it's impossible.	3	13	1	1	\N
127	2014-12-18 22:22:55.583	2014-12-18 22:22:55.583	Three players either leave the space or cover their ears and turn around so they can't hear the suggestion. A fourth player (we'll call him 'A') gets a common phrase or expression from the audience. Using only mime and gibberish, 'A' has to convey the expression to 'B' while the other two still don't watch. 'B' then gives the message to 'C' and likewise 'C' to 'D.' At the end, have the four players explain what phrase they thought it was.	1	12	1	1	\N
128	2014-12-18 22:27:51.262	2014-12-18 22:27:51.262	Three (or four) players do a scene, with a DEATH DEFYING TWIST. A bucket is placed on a table to the side of the stage, full of water. At all times, one of the players in the scene must have his or her head in the bucket. The other players must come up with reasons to leave the scene to tag in the player in the bucket and relieve him or her. Don't let anybody die, please.	1	8	1	1	\N
129	2014-12-18 22:33:02.42	2014-12-18 22:33:02.42	So many of these games involve getting everybody all up in a circle. This is one of them. Get everybody all up in a circle. Somebody starts as "it" and gives everybody a moment to ask the names of the people standing on either side of them. Then "it" goes up to a player and yells "[player's name], bumpity bump bump bump." The player has to say the names of the two players on either side of them before "it" finishes saying "bump bump bump." If you fail, you become "it." If you are getting bored, "it" can just generally yell, "bumpity bump bump bump" and all of the players have to scatter, forming an entirely new circle with entirely new neighbors.	3	4	1	1	\N
130	2014-12-19 16:04:46.269	2014-12-19 16:04:46.269	Circle up, circle down, circle over, circle in any preposition you want, as long as it means "gather everybody into a circle." Pick somebody to go first, and he will form a "bunny" with the player on either side of him. To form the bunny, the player in the middle holds his hands to his chest (you know, like a bunny would), and the players on either side holds their hands up in the shape of big rabbit ears on either side of his head. Alternatively, the three players can just each be a bunny all on their own - I don't care. The point is that three players all start saying "bunny" and hopping up and down really fast. The goal is to be as ridiculously manic and crazy as possible. The players keep doing it until the middle player throws the mystical bunny energy to someone across the circle. When the energy is passed to you (or somebody next to you), you had better bunny up.	3	4	1	1	\N
131	2014-12-19 16:38:04.463	2014-12-19 16:38:04.463	I'm running out of funny ways to tell you to get into a circle, so just do it and I'll think about it. Everybody starts chanting "Ooo-chah, ooo-chah" to develop a slow, steady rhythm. Now somebody starts by saying "bunny, bunny," holding their fingers in front of their face like teeth, and then holds their fingers out with the same "front teeth" gesture pointing at somebody across the circle, saying "bunny, bunny" to them. This all happens along with the beat of the underlying chant. The person that was bunny'd at now does it again, passing it to somebody else. Yes, it will look weird and probably creepy if somebody didn't know what was going on. That's okay.	3	4	1	1	\N
132	2015-03-14 13:02:13.69	2015-03-14 13:02:13.69	<p>To start this warmup, everybody should get a quick rhythm going by tapping on their thighs or whatever. This isn't a rhythm to follow or anything, it's more of a steady drum roll to keep the energy up.</p>\n<p>Somebody in the group starts by picking somebody at random and saying, "hey [name of person]!"</p>\n<p>"What's up, [name of other person]," they might respond (or any other way, I don't care).</p>\n<p>The first person then asks for five things of some category, like "What are five things you could find in your shoe?" or "What are five things that can fly?"</p>\n<p>The person then comes up with five things that fit the category. There are no right or wrong answers here, just say whatever. After each thing, the group will count them together, chanting "One!" and "two!" and etcetera (you can count to five, right?). After the last one, everybody says "these are five things!" Then the person who just listed things calls somebody else out, and prompts them with another category. Keep going until everybody has gone, saving the person who asked the first question for last.</p>	1	4	1	1	\N
1	2013-11-21 17:36:13	2013-11-04 21:05:25	<p>Everybody stand in a line in front of the audience. Good job, that was the hard part.  Now you can get suggestions for basically anything (nouns work best, though), and the group takes turns making jokes about those suggestions.  The jokes all follow the standard structure, "185 [items] walk into a bar. The bartender says 'we don't serve [items] here.' They ask, 'hey, why not?' [punchline]."</p>\n\n<p>Feel free to make variations on the theme of "185 [items] walks into a bar, something happens." For example, you could say "185 Eskimos walk into a bar. They each have their own word for 'beer.'" I don't know.</p>	1	4	1	1	\N
\.


--
-- TOC entry 3057 (class 0 OID 0)
-- Dependencies: 177
-- Name: game_GameID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"game_GameID_seq"', 132, true);


--
-- TOC entry 3008 (class 0 OID 16419)
-- Dependencies: 178
-- Data for Name: name; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY name ("NameID", "GameID", "Name", "Weight", "DateAdded", "DateModified", "AddedUserID", "ModifiedUserID") FROM stdin;
1	1	185	1	2013-11-04 21:05:28	2013-11-04 21:05:28	1	1
2	2	Freeze	2	2013-11-04 21:08:37	2013-11-04 21:08:37	1	1
3	2	Freeze Tag	1	2013-11-04 21:15:38	2013-11-04 21:15:38	1	1
5	4	Word at a time Story	1	2013-11-10 16:04:27	2013-11-10 16:04:27	1	1
6	5	3 Things	1	2013-11-10 16:08:03	2013-11-10 16:08:03	1	1
7	6	Alphabet Scene	1	2013-11-10 16:09:56	2013-11-10 16:09:56	1	1
8	7	Pet-peeve Rant	1	2013-11-10 21:52:27	2013-11-10 21:52:27	1	1
9	8	Press Conference	1	2013-11-10 22:04:38	2013-11-10 22:04:38	1	1
10	9	Blind Date	1	2013-11-10 22:09:51	2013-11-10 22:09:51	1	1
11	10	Blind Freeze	1	2013-11-10 22:12:21	2013-11-10 22:12:21	1	1
12	11	Anti Freeze	1	2013-11-11 18:04:30	2013-11-11 18:04:30	1	1
14	13	Changing Emotions	1	2013-11-11 18:08:27	2013-11-11 18:08:27	1	1
18	17	Arms	1	2013-11-11 18:14:51	2013-11-11 18:14:51	1	1
20	19	Before or After	1	2013-11-11 18:19:10	2013-11-11 18:19:10	1	1
21	20	Blindfold Scene	1	2013-11-11 18:25:31	2013-11-11 18:25:31	1	1
22	21	Nightmare	1	2013-11-11 21:42:43	2013-11-11 21:42:43	1	1
23	22	First Line / Last Line	1	2013-11-11 21:45:36	2013-11-11 21:45:36	1	1
24	23	Complaint Department	1	2013-11-11 21:47:47	2013-11-11 21:47:47	1	1
25	24	Chain Murder Mystery	1	2013-11-12 15:20:12	2013-11-12 15:20:12	1	1
26	25	Sideline Debate	1	2013-11-12 15:23:01	2013-11-12 15:23:01	1	1
27	26	Continuation	1	2013-11-21 15:29:59	2013-11-21 15:29:59	1	1
28	27	Foreign Film Dubbing	1	2013-11-22 09:19:39	2013-11-22 09:19:39	1	1
29	28	Party Quirks	1	2013-11-22 09:28:16	2013-11-22 09:28:16	1	1
30	29	Secrets	1	2013-11-22 09:38:22	2013-11-22 09:38:22	1	1
31	30	Triggers	1	2013-11-22 09:45:50	2013-11-22 09:45:50	1	1
33	32	Green Ghost	1	2013-11-22 09:51:15	2013-11-22 09:51:15	1	1
34	33	What are you doing?	1	2013-11-22 09:53:31	2013-11-22 09:53:31	1	1
35	34	Bitch Concerto	1	2013-11-22 09:54:53	2013-11-22 09:54:53	1	1
38	37	B Movie	1	2013-11-22 09:58:08	2013-11-22 09:58:08	1	1
39	38	Death Pendulum	1	2013-11-22 09:59:38	2013-11-22 09:59:38	1	1
40	39	Dating Game	1	2013-11-22 10:03:47	2013-11-22 10:03:47	1	1
41	40	Day in the Life	1	2013-11-22 10:05:17	2013-11-22 10:05:17	1	1
42	41	Dead Monkeys	1	2013-11-22 10:06:47	2013-11-22 10:06:47	1	1
43	42	Deaf Interpreter	1	2013-11-22 10:09:16	2013-11-22 10:09:16	1	1
44	43	Do Run / Do Rap	1	2013-11-22 10:32:39	2013-11-22 10:32:39	1	1
45	44	Emotion Replay	1	2013-11-22 10:35:02	2013-11-22 10:35:02	1	1
46	45	Emotion Symphony	1	2013-11-22 10:37:24	2013-11-22 10:37:24	1	1
47	46	Emotion Zones	1	2013-11-22 10:39:19	2013-11-22 10:39:19	1	1
48	47	Evil Twin	1	2013-11-22 10:39:51	2013-11-22 10:39:51	1	1
49	48	Film Noire	1	2013-11-22 10:41:06	2013-11-22 10:41:06	1	1
50	49	Forward / Reverse	1	2013-11-22 10:42:11	2013-11-22 10:42:11	1	1
51	50	Get out of that Chair	1	2013-11-22 10:43:15	2013-11-22 10:43:15	1	1
52	51	Good Advice, Bad Advice, Worst Advice	1	2013-11-22 10:47:38	2013-11-22 10:47:38	1	1
53	52	History	1	2013-11-22 10:48:58	2013-11-22 10:48:58	1	1
54	53	Interrogation	1	2013-11-22 10:49:48	2013-11-22 10:49:48	1	1
55	54	Interpretive Dance	1	2013-11-22 10:50:57	2013-11-22 10:50:57	1	1
56	55	Genre Replay	1	2013-11-22 10:52:02	2013-11-22 10:52:02	1	1
57	56	Musical Theatre	1	2013-11-22 10:53:28	2013-11-22 10:53:28	1	1
60	59	Electric Company	1	2013-11-22 10:57:05	2013-11-22 10:57:05	1	1
61	60	Bibbity Bibbity Bop	1	2013-11-22 10:57:59	2013-11-22 10:57:59	1	1
62	61	N-Word Scenes	1	2013-11-22 10:59:18	2013-11-22 10:59:18	1	1
64	62	Sit, Stand, Lie Down	1	2014-12-01 21:29:13.202	2014-12-01 21:29:13.202	1	1
66	64	Changing Genres	1	2014-12-01 21:37:21.981	2014-12-01 21:37:21.981	1	1
67	65	Where are your Papers?	1	2014-12-01 21:42:33.38	2014-12-01 21:42:33.38	1	1
68	66	I Wonder	1	2014-12-01 21:53:47.936	2014-12-01 21:53:47.936	1	1
75	68	Character Relay	1	2014-12-01 22:21:29.404	2014-12-01 22:21:29.404	1	1
76	69	Life Boat	1	2014-12-01 22:26:04.642	2014-12-01 22:26:04.642	1	1
77	70	Serendipity	1	2014-12-01 22:30:09.853	2014-12-01 22:30:09.853	1	1
78	71	Channel Changer	1	2014-12-01 22:33:25.989	2014-12-01 22:33:25.989	1	1
79	72	Challenge!	1	2014-12-01 22:40:32.212	2014-12-01 22:40:32.212	1	1
80	73	I'm not a Doctor	1	2014-12-01 22:46:41.155	2014-12-01 22:46:41.155	1	1
81	74	Buzzard Symphony	1	2014-12-01 22:49:37.723	2014-12-01 22:49:37.723	1	1
82	75	Beads on a String	1	2014-12-01 22:55:04.828	2014-12-01 22:55:04.828	1	1
83	76	Vacation	1	2014-12-02 10:07:29.436	2014-12-02 10:07:29.436	1	1
85	78	Excuses	1	2014-12-02 10:21:40.108	2014-12-02 10:21:40.108	1	1
86	79	Entrances and Exits	1	2014-12-02 10:24:45.822	2014-12-02 10:24:45.822	1	1
87	80	Onion Peel	1	2014-12-02 10:32:01.729	2014-12-02 10:32:01.729	1	1
88	81	What Will They Think of Next? (TM)	1	2014-12-02 10:37:52.622	2014-12-02 10:37:52.622	1	1
90	83	Super Heroes	1	2014-12-02 11:23:42.437	2014-12-02 11:23:42.437	1	1
91	84	Bathroom	1	2014-12-02 11:28:29.237	2014-12-02 11:28:29.237	1	1
92	85	World's Worst	1	2014-12-02 11:31:48.443	2014-12-02 11:31:48.443	1	1
94	87	Slo-mo Sports	2	2014-12-02 14:31:10.214	2014-12-02 14:31:10.214	1	1
17	16	Animals	2	2013-11-11 18:13:11	2014-12-03 11:35:40.582	1	1
84	77	Hitchhiker	2	2014-12-02 10:14:01.325	2014-12-03 11:43:58.246	1	1
69	67	Inner Thoughts	2	2014-12-01 22:03:30.718	2014-12-03 11:44:30.662	1	1
63	3	Shoulda' Said	2	2014-12-01 19:40:06.896	2014-12-03 11:46:04.678	1	1
59	58	Professor Know-it-all	2	2013-11-22 10:55:09	2014-12-03 11:47:36.016	1	1
37	36	Countdown	2	2013-11-22 09:57:34	2014-12-04 09:32:43.057	1	1
58	57	Questions Only	2	2013-11-22 10:54:18	2014-12-04 09:54:43.551	1	1
32	31	Circle, Square, Triangle	2	2013-11-22 09:50:15	2014-12-14 18:37:14.106	1	1
16	15	Air Traffic Control	2	2013-11-11 18:11:34	2014-12-15 17:49:22.647	1	1
19	18	Movie Critics	2	2013-11-11 18:16:16	2014-12-16 10:19:29.525	1	1
89	82	Blind Line	2	2014-12-02 11:18:27.797	2014-12-18 22:25:11.071	1	1
36	35	Conduct a Story	2	2013-11-22 09:55:30	2015-01-03 13:08:09.582	1	1
93	86	Four Square	2	2014-12-02 11:41:12.771	2015-02-02 09:15:42.489	1	1
98	2	Freeze and Justify	1	2014-12-02 21:14:12.123	2014-12-02 21:14:12.123	1	1
104	57	Questions	1	2014-12-02 21:22:17.364	2014-12-02 21:22:17.364	1	1
105	67	Innerminds	1	2014-12-02 21:23:29.86	2014-12-02 21:23:29.86	1	1
106	87	Wide Wide World of Everyday Life	1	2014-12-02 21:26:40.735	2014-12-02 21:26:40.735	1	1
107	18	Weak Previews	1	2014-12-02 21:28:05.801	2014-12-02 21:28:05.801	1	1
108	27	Foreign Movies	1	2014-12-02 21:29:49.479	2014-12-02 21:29:49.479	1	1
109	35	Story Story Die	1	2014-12-02 21:31:14.096	2014-12-02 21:31:14.096	1	1
110	13	Emotional Hurdles	1	2014-12-02 21:31:55.479	2014-12-02 21:31:55.479	1	1
111	58	Expert	1	2014-12-02 21:33:44.915	2014-12-02 21:33:44.915	1	1
112	16	Animal Crackers	1	2014-12-02 21:34:02.597	2014-12-02 21:34:02.597	1	1
113	3	New Choice	1	2014-12-02 21:36:07.112	2014-12-02 21:36:07.112	1	1
114	36	Instant Replay	1	2014-12-02 21:43:02.284	2014-12-02 21:43:02.284	1	1
115	77	Taxi Cab	1	2014-12-03 11:43:54.858	2014-12-03 11:43:54.858	1	1
116	90	Action Hero	1	2014-12-04 09:52:21.07	2014-12-04 09:52:21.07	1	1
117	91	Props	1	2014-12-14 18:28:46.227	2014-12-14 18:28:46.227	1	1
119	31	Three Lines	1	2014-12-14 18:37:11.488	2014-12-14 18:37:11.488	1	1
121	93	3 Series	1	2014-12-14 18:46:43.768	2014-12-14 18:46:43.768	1	1
120	93	Pattern Circle	2	2014-12-14 18:45:58.697	2014-12-14 18:46:45.313	1	1
122	92	10 Fingers	1	2014-12-14 18:46:56.526	2014-12-14 18:46:56.526	1	1
118	92	Ten Fingers	2	2014-12-14 18:36:45.764	2014-12-14 18:46:59.109	1	1
123	94	Three Some	1	2014-12-14 18:54:16.178	2014-12-14 18:54:16.178	1	1
124	95	Accepting Circle	1	2014-12-14 18:58:47.068	2014-12-14 18:58:47.068	1	1
125	95	Energy Circle	1	2014-12-14 18:59:01.603	2014-12-14 18:59:01.603	1	1
126	96	Action Names	1	2014-12-14 19:04:53.976	2014-12-14 19:04:53.976	1	1
127	97	Understudy	1	2014-12-15 17:36:58.821	2014-12-15 17:36:58.821	1	1
128	97	Changing Actors	1	2014-12-15 17:37:44.944	2014-12-15 17:37:44.944	1	1
129	98	Advancing and Expanding	1	2014-12-15 17:46:18.277	2014-12-15 17:46:18.277	1	1
130	99	Three Rules	1	2014-12-15 17:48:58.083	2014-12-15 17:48:58.083	1	1
131	15	Airplane	1	2014-12-15 17:49:16.068	2014-12-15 17:49:16.068	1	1
132	15	Blind Lead	1	2014-12-15 17:49:20.367	2014-12-15 17:49:20.367	1	1
133	100	Ali Baba and the Forty Thieves	1	2014-12-15 17:56:09.773	2014-12-15 17:56:09.773	1	1
134	101	Alien Tiger Cow	1	2014-12-15 17:59:31.682	2014-12-15 17:59:31.682	1	1
135	102	Alliteration Introduction	1	2014-12-15 18:17:25.61	2014-12-15 18:17:25.61	1	1
136	103	Alliteration	1	2014-12-15 18:23:32.691	2014-12-15 18:23:32.691	1	1
137	104	Alphabet Circle	1	2014-12-16 09:56:59.762	2014-12-16 09:56:59.762	1	1
138	67	Asides	1	2014-12-16 09:58:12.103	2014-12-16 09:58:12.103	1	1
139	105	Friends and Enemies	1	2014-12-16 10:05:40.227	2014-12-16 10:05:40.227	1	1
140	106	Tableaus	1	2014-12-16 10:11:35.873	2014-12-16 10:11:35.873	1	1
142	107	Feature Film	1	2014-12-16 10:17:32.875	2014-12-16 10:17:32.875	1	1
143	107	At the Movies	1	2014-12-16 10:17:40.389	2014-12-16 10:17:40.389	1	1
141	107	Director	2	2014-12-16 10:17:09.582	2014-12-16 10:17:41.754	1	1
144	108	Automatic Storytelling	1	2014-12-16 10:26:17.969	2014-12-16 10:26:17.969	1	1
145	109	Historical Replay	1	2014-12-16 10:31:53.956	2014-12-16 10:31:53.956	1	1
146	110	Actor Replay	1	2014-12-16 10:36:42.317	2014-12-16 10:36:42.317	1	1
147	111	Backwards Interview	1	2014-12-16 10:41:28.214	2014-12-16 10:41:28.214	1	1
148	36	Half Life	1	2014-12-16 10:42:32.348	2014-12-16 10:42:32.348	1	1
149	112	Baladeer	1	2014-12-16 10:45:17.362	2014-12-16 10:45:17.362	1	1
150	113	Bandaid Tag	1	2014-12-16 11:00:00.657	2014-12-16 11:00:00.657	1	1
151	114	Barney	1	2014-12-16 11:14:14.035	2014-12-16 11:14:14.035	1	1
152	115	Barnyard	1	2014-12-17 11:31:43.506	2014-12-17 11:31:43.506	1	1
153	116	Catch 'Em	1	2014-12-17 11:38:49.238	2014-12-17 11:38:49.238	1	1
154	117	Beasty Rap	1	2014-12-17 12:10:26.71	2014-12-17 12:10:26.71	1	1
155	118	Beatnik Poet	1	2014-12-17 12:15:33.487	2014-12-17 12:15:33.487	1	1
156	119	Become	1	2014-12-17 12:18:37.212	2014-12-17 12:18:37.212	1	1
157	120	Hat Continuation	1	2014-12-17 15:15:56.023	2014-12-17 15:15:56.023	1	1
158	121	Big Booty	1	2014-12-17 15:35:11.464	2014-12-17 15:35:11.464	1	1
159	122	Big Fish Small Fish	1	2014-12-17 16:26:38.927	2014-12-17 16:26:38.927	1	1
160	123	Blind Line Offers	1	2014-12-18 21:46:05.047	2014-12-18 21:46:05.047	1	1
161	124	Group Order	1	2014-12-18 21:57:57.825	2014-12-18 21:57:57.825	1	1
163	125	Goalie	1	2014-12-18 22:16:18.98	2014-12-18 22:16:18.98	1	1
162	125	Scene Gauntlet	1	2014-12-18 22:15:57.721	2014-12-18 22:16:21.471	1	1
164	126	Body Hide	1	2014-12-18 22:19:36.317	2014-12-18 22:19:36.317	1	1
165	127	Bong Bong Bong	1	2014-12-18 22:22:55.602	2014-12-18 22:22:55.602	1	1
166	31	Boom Chicago	1	2014-12-18 22:23:59.094	2014-12-18 22:23:59.094	1	1
167	82	Bucket	1	2014-12-18 22:25:09.585	2014-12-18 22:25:09.585	1	1
168	128	Bucket of Death	1	2014-12-18 22:27:51.284	2014-12-18 22:27:51.284	1	1
169	129	Bumpity Bump	1	2014-12-18 22:33:02.441	2014-12-18 22:33:02.441	1	1
170	130	Bunny	1	2014-12-19 16:04:46.287	2014-12-19 16:04:46.287	1	1
171	131	Bunny Chant	1	2014-12-19 16:38:04.485	2014-12-19 16:38:04.485	1	1
172	86	Shift Left	1	2015-02-02 09:15:02.111	2015-02-02 09:15:02.111	1	1
176	132	5 Things	1	2015-03-14 13:02:31.867	2015-03-14 13:02:31.867	1	1
175	132	Five Things	2	2015-03-14 13:02:13.776	2015-03-14 13:02:33.531	1	1
\.


--
-- TOC entry 3058 (class 0 OID 0)
-- Dependencies: 179
-- Name: name_NameID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"name_NameID_seq"', 176, true);


--
-- TOC entry 3010 (class 0 OID 16424)
-- Dependencies: 180
-- Data for Name: note; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY note ("NoteID", "GameID", "Description", "Public", "DateAdded", "DateModified", "AddedUserID", "ModifiedUserID", "TagID", "DurationID", "PlayerCountID") FROM stdin;
2	82	Please don't just pull a note out of your pocket and say "well, my grandma always said, 'herp derp plerp whatever.'" That's a cop-out and super lame. Own the lines, because having to justify them is the fun part.	1	2014-12-03 12:34:23.933	2014-12-03 12:34:23.933	1	1	\N	\N	\N
4	\N	Don't be afraid! If nobody else is stepping forward, just do it - whether you have an idea or not. Just make something up! It's always better in these line-up games to have an awkward non-joke than an awkward silence.	1	2014-12-03 18:06:41.325	2014-12-03 18:06:41.325	1	1	13	\N	\N
6	\N	Don't wait until you have a good idea for a scene, because that will never work out. Just wait for a high moment in a scene, or for somebody in the scene to have a crazy position - then freeze it. You'll come up with something once you get into position.	1	2014-12-03 18:22:11.38	2014-12-03 18:22:11.38	1	1	29	\N	\N
7	11	Anti-Freeze is a good way to "ease into" doing long form.	1	2014-12-03 18:24:10.514	2014-12-03 18:24:10.514	1	1	\N	\N	\N
8	\N	Feel free to "walk on" to a scene to support (if it needs support), turning a two-person scene into a three-, four-, five-, or whatever-person one. When you freeze a scene with more than two people, you can tag as many people as you want to get rid of to bring it back down. Get a feel for the pace, and keep it reasonable - there's no reason to have tons of people on stage for long.	1	2014-12-03 18:31:42.209	2014-12-03 18:31:42.209	1	1	29	\N	\N
9	57	This game is dumb. Honestly, I hate it. Most people will tell you to avoid questions in improv, but here we'll play a game entirely made of questions? It never ends well.	1	2014-12-04 09:53:34.605	2014-12-04 09:53:34.605	1	1	\N	\N	\N
10	95	Alternatively, you can play up the "mutation" by having each person heighten the action like crazy, so as it goes around it just becomes more and more ridiculous and chaotic.	1	2014-12-14 18:59:45.376	2014-12-14 18:59:45.376	1	1	\N	\N	\N
11	82	You don't have to play this with lines from the audience. Give each actor a different book or script or whatever, and they can open to a random page and read a sentence from there. That's super fun and helps you avoid the inevitable audience member who thinks writing "look at my penis" or something is the funniest thing (pro tip: it isn't).	1	2014-12-15 17:39:22.959	2014-12-15 17:39:22.959	1	1	\N	\N	\N
12	49	The trick here is to really repeat everything that has happened, exactly as it happened. When 'reverse' is called, the exact same lines should be said in reverse order, and then 'forward' will play the scene exactly as it just happened. We're watching a video played backwards and forwards - it's always the same thing.	1	2014-12-16 10:33:39.329	2014-12-16 10:33:39.329	1	1	\N	\N	\N
13	60	Another action is "Elephant." The player on the outside forms an elephant's trunk (he holds his nose with one hand, and his other arm sticks out like a trunk), and the players on each side of him form the elephant's ears with their arms.	1	2014-12-16 11:10:59.769	2014-12-16 11:10:59.769	1	1	\N	\N	\N
1	2	A good way to practice editing and scene development at the same time.  Try mixing several of the variations for extreme challenge.	1	2013-11-05 11:57:51	2015-02-02 10:38:00.456	1	1	\N	\N	\N
\.


--
-- TOC entry 3059 (class 0 OID 0)
-- Dependencies: 181
-- Name: note_NoteID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"note_NoteID_seq"', 13, true);


--
-- TOC entry 3012 (class 0 OID 16432)
-- Dependencies: 182
-- Data for Name: permissionkey; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY permissionkey ("Name", "PermissionKeyID") FROM stdin;
note_group	1
note_public	2
name_submit	3
name_vote	4
group_create	5
group_edit	6
group_users	7
user_lock	8
user_edit	9
user_promote	10
game_create	11
game_edit	12
game_delete	13
name_update	15
name_delete	16
user_delete	17
meta_create	18
meta_delete	19
meta_update	20
\.


--
-- TOC entry 3060 (class 0 OID 0)
-- Dependencies: 183
-- Name: permissionkey_PermissionKeyID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"permissionkey_PermissionKeyID_seq"', 20, true);


--
-- TOC entry 3014 (class 0 OID 16437)
-- Dependencies: 184
-- Data for Name: permissionkeyuserlevel; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY permissionkeyuserlevel ("PermissionKeyUserLevelID", "PermissionKeyID", "UserLevelID") FROM stdin;
1	1	1
2	3	1
3	4	1
4	5	1
5	6	2
6	7	2
7	8	3
8	2	3
9	11	3
10	12	3
11	13	3
12	9	4
13	10	4
14	15	4
15	16	4
16	17	3
17	18	3
18	19	4
19	20	4
\.


--
-- TOC entry 3061 (class 0 OID 0)
-- Dependencies: 185
-- Name: permissionkeyuserlevel_PermissionKeyUserLevelID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"permissionkeyuserlevel_PermissionKeyUserLevelID_seq"', 19, true);


--
-- TOC entry 3016 (class 0 OID 16442)
-- Dependencies: 186
-- Data for Name: playercount; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY playercount ("PlayerCountID", "Name", "Description", "Min", "Max", "DateAdded", "DateModified", "AddedUserID", "ModifiedUserID") FROM stdin;
1	Pair	Perfect for a pair of improvisers. That's two, if you're not great at words.	2	2	2013-11-04 18:13:59	2013-11-04 18:13:59	1	1
2	Three	Three is the number of people who can play this game, and the number of players shall be "three."	3	3	2013-11-04 18:19:41	2013-11-04 18:19:41	1	1
4	Any	It really doesn't matter how many people you have. Player count not important only life important.	\N	\N	2013-11-04 20:18:38	2013-11-04 20:18:38	1	1
5	At least Two	They say one is the loneliest number. I agree, because hey - one isn't even enough to play this game.	1	\N	2013-11-04 20:20:56	2013-11-04 20:20:56	1	1
6	More than 2	You'll need more than two to tango for this one.	2	\N	2013-11-04 21:06:59	2013-11-04 21:06:59	1	1
7	2 and 2	Two players are in this game. Oh yeah, also there are two other players in this game. I guess that makes four, but they're sort of in teams.	2	2	2013-11-12 15:10:13	2013-11-12 15:10:13	1	1
8	3 or 4	You can use three players, or your can use four. It's your choice - but beware! You could . . . eh, nothing bad will happen. It doesn't really matter.	3	4	2013-11-12 15:12:21	2013-11-12 15:12:21	1	1
9	Two Teams of 3	It's like Gus Macker, except it's less dumb because it isn't basketball. I would apologize for offending you, but if you like basketball you probably didn't notice anyway.	6	6	2013-11-12 15:17:39	2013-11-12 15:17:39	1	1
10	Two teams of at least Two	All that matters is that you have two even teams here. How big the teams are is up to you, but maybe you should take it easy, yeah?	4	\N	2013-11-21 15:29:48	2013-11-21 15:29:48	1	1
11	At least 2 plus 1	Some would just say three, but I'm not one of those.	3	\N	2013-11-21 17:45:48	2013-11-21 17:45:48	1	1
12	Four	A game with four players in it! Not one or two or three but four! Four players!	4	4	2013-11-22 09:28:14	2013-11-22 09:28:14	1	1
13	Five	All of the best teams have five people. The Beatles, Monty Python, The Marx Brothers, the list goes on and on. What do you mean none of those had five people?	5	5	2013-11-22 10:03:11	2013-11-22 10:03:11	1	1
14	Probably at least 8	This will require a good, sizable group to work well, so you'll have to make some more friends. Jeez, it's just like high school all over again.	8	30	2014-12-01 21:42:30.737	2014-12-01 21:44:56.551	1	1
15	Three plus One	My grandma always said you should never have an odd number of boys in a room together. Always have a referee.	4	4	2014-12-01 22:40:20.674	2014-12-01 22:40:20.674	1	1
16	Four plus One	Four people play this game. Also another person plays this game, but in a different capacity. It's like a barbershop quartet with some annoying tone-deaf dude that always follows them around.	5	5	2014-12-02 11:41:04.926	2014-12-02 11:41:04.926	1	1
17	One or Two	If somebody on your team is really stinky or something you can make them do this by themsevles.	1	2	2014-12-15 17:46:13.467	2014-12-15 17:46:13.467	1	1
\.


--
-- TOC entry 3062 (class 0 OID 0)
-- Dependencies: 187
-- Name: playercount_PlayerCountID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"playercount_PlayerCountID_seq"', 17, true);


--
-- TOC entry 3018 (class 0 OID 16450)
-- Dependencies: 188
-- Data for Name: suggestion; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY suggestion ("SuggestionID", "SuggestionTypeID", "Name", "DateAdded", "DateModified", "AddedUserID", "ModifiedUserID") FROM stdin;
\.


--
-- TOC entry 3063 (class 0 OID 0)
-- Dependencies: 189
-- Name: suggestion_SuggestionID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"suggestion_SuggestionID_seq"', 1, false);


--
-- TOC entry 3020 (class 0 OID 16455)
-- Dependencies: 190
-- Data for Name: suggestiontype; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY suggestiontype ("SuggestionTypeID", "Name", "Description", "DateAdded", "DateModified", "AddedUserID", "ModifiedUserID") FROM stdin;
\.


--
-- TOC entry 3064 (class 0 OID 0)
-- Dependencies: 191
-- Name: suggestiontype_SuggestionTypeID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"suggestiontype_SuggestionTypeID_seq"', 1, false);


--
-- TOC entry 3022 (class 0 OID 16463)
-- Dependencies: 192
-- Data for Name: suggestiontypegame; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY suggestiontypegame ("SuggestionTypeGameID", "SuggestionTypeID", "GameID", "Description", "DateAdded", "AddedUserID") FROM stdin;
\.


--
-- TOC entry 3065 (class 0 OID 0)
-- Dependencies: 193
-- Name: suggestiontypegame_SuggestionTypeGameID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"suggestiontypegame_SuggestionTypeGameID_seq"', 1, false);


--
-- TOC entry 3024 (class 0 OID 16471)
-- Dependencies: 194
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY tag ("TagID", "Name", "Description", "DateAdded", "AddedUserID", "ModifiedUserID") FROM stdin;
1	Show	This game would be appropriate in a show, or maybe it wouldn't be appropriate, depending on what type of show you're doing.	2013-11-04 21:58:24	1	1
4	Longform	\N	2013-11-11 17:44:23	1	1
6	Scenic	\N	2013-11-11 18:08:18	1	1
7	Audience	\N	2013-11-11 21:42:13	1	1
8	Group	\N	2013-11-11 21:42:30	1	1
9	Gibberish	\N	2013-11-11 21:44:12	1	1
10	Guessing	\N	2013-11-11 21:46:40	1	1
11	Teams	\N	2013-11-12 15:22:39	1	1
12	Character	\N	2013-11-21 15:28:22	1	1
13	Stand and Deliver	\N	2013-11-21 15:57:22	1	1
14	Trust	\N	2013-11-21 16:08:09	1	1
15	Conductor	\N	2013-11-22 09:54:28	1	1
16	Timed	\N	2013-11-22 09:56:02	1	1
17	Round	\N	2013-11-22 09:59:53	1	1
18	Game Show	\N	2013-11-22 10:02:00	1	1
19	Solo	\N	2013-11-22 10:05:57	1	1
20	Mime	\N	2013-11-22 10:08:40	1	1
21	Rhyming	\N	2013-11-22 10:32:31	1	1
22	Replay	\N	2013-11-22 10:33:06	1	1
23	Singing	\N	2013-11-22 10:53:13	1	1
24	Warmup	\N	2013-11-22 10:55:23	1	1
25	Opener	\N	2013-11-22 11:00:34	1	1
26	Circle	\N	2014-12-01 21:40:35.286	1	1
27	Energy	\N	2014-12-01 21:40:43.492	1	1
28	Gifts	\N	2014-12-01 21:48:59.537	1	1
29	Freeze	\N	2014-12-01 21:57:01.503	1	1
30	Narration	\N	2014-12-01 22:03:01.8	1	1
31	Story	\N	2014-12-01 22:25:37.04	1	1
32	Relationship	\N	2014-12-01 22:25:47.455	1	1
33	Debate	\N	2014-12-01 22:38:12.809	1	1
34	Competition	\N	2014-12-01 22:38:25.45	1	1
35	No Wrong Answers	\N	2014-12-01 22:55:58.888	1	1
36	Be 100%	\N	2014-12-02 10:13:18	1	1
37	Justify	\N	2014-12-02 10:25:09.553	1	1
38	Give and Take	\N	2014-12-02 10:28:33.648	1	1
39	Accents	\N	2014-12-02 10:37:10.896	1	1
40	Talk Show	\N	2014-12-02 10:37:18.015	1	1
41	Host	\N	2014-12-02 10:37:30.756	1	1
42	Objects	\N	2014-12-02 10:37:40.491	1	1
43	Yes And	\N	2014-12-02 11:28:02.695	1	1
44	Caller	\N	2014-12-02 11:38:49.952	1	1
45	Memory	\N	2014-12-02 11:45:06.598	1	1
46	Slow-mo	\N	2014-12-02 14:30:36.296	1	1
47	Commentators	\N	2014-12-02 14:30:49.707	1	1
3	Exercise	\N	2013-11-11 17:41:04	1	1
48	Props	\N	2014-12-14 18:08:59.154	1	1
49	Icebreaker	\N	2014-12-14 18:36:23.162	1	1
50	Limitations	\N	2014-12-15 17:48:40.944	1	1
51	Alphabet	\N	2014-12-16 09:56:42.426	1	1
52	Pointing and Passing	\N	2014-12-16 09:56:53.604	1	1
53	Walk About	\N	2014-12-16 10:04:20.279	1	1
54	Emergence	\N	2014-12-16 10:04:39.262	1	1
55	Tableaus	\N	2014-12-16 10:11:13.552	1	1
56	Be Trustworthy	\N	2014-12-16 10:11:22.14	1	1
57	Two Lines	\N	2014-12-16 10:19:07.46	1	1
58	History	\N	2014-12-16 10:31:24.617	1	1
59	Backwards	\N	2014-12-16 10:41:03.171	1	1
60	Animals	\N	2014-12-17 11:30:45.377	1	1
61	It	\N	2014-12-17 11:38:30.9	1	1
62	Rap	\N	2014-12-17 12:10:07.054	1	1
63	Rhythm	\N	2014-12-17 15:31:45.546	1	1
64	Passing Energy	\N	2014-12-18 21:35:04.575	1	1
65	Actions	\N	2014-12-18 21:45:52.472	1	1
66	Initiation	\N	2014-12-18 21:45:58.059	1	1
67	Drama	\N	2015-03-25 10:08:56.994	1	1
68	Reverse	\N	2015-03-25 10:14:41.3	1	1
\.


--
-- TOC entry 3066 (class 0 OID 0)
-- Dependencies: 195
-- Name: tag_TagID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"tag_TagID_seq"', 68, true);


--
-- TOC entry 3026 (class 0 OID 16479)
-- Dependencies: 196
-- Data for Name: taggame; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY taggame ("TagGameID", "TagID", "GameID", "DateAdded", "AddedUserID", "ModifiedUserID") FROM stdin;
1	1	2	2013-11-04 21:58:26	1	1
2	1	20	2013-11-11 18:25:31	1	1
3	6	20	2013-11-11 18:25:31	1	1
4	7	21	2013-11-11 21:42:43	1	1
5	1	21	2013-11-11 21:42:43	1	1
6	8	21	2013-11-11 21:42:43	1	1
7	1	22	2013-11-11 21:45:36	1	1
8	6	22	2013-11-11 21:45:36	1	1
9	1	23	2013-11-11 21:47:47	1	1
10	10	23	2013-11-11 21:47:47	1	1
14	11	25	2013-11-12 15:23:01	1	1
15	9	25	2013-11-12 15:23:01	1	1
16	10	25	2013-11-12 15:23:01	1	1
17	10	24	2013-11-21 14:39:13	1	1
18	9	24	2013-11-21 14:39:13	1	1
19	7	24	2013-11-21 14:39:13	1	1
20	1	1	2013-11-21 15:11:07	1	1
32	6	26	2013-11-21 15:29:59	1	1
33	12	26	2013-11-21 15:29:59	1	1
34	1	26	2013-11-21 15:29:59	1	1
35	3	26	2013-11-21 15:29:59	1	1
36	13	1	2013-11-21 15:57:22	1	1
37	1	5	2013-11-21 15:58:58	1	1
38	10	5	2013-11-21 15:59:08	1	1
39	9	5	2013-11-21 15:59:19	1	1
40	6	6	2013-11-21 16:07:53	1	1
41	3	15	2013-11-21 16:08:01	1	1
42	14	15	2013-11-21 16:08:09	1	1
43	6	16	2013-11-21 16:08:21	1	1
44	6	11	2013-11-21 16:09:03	1	1
45	1	11	2013-11-21 16:09:05	1	1
48	1	17	2013-11-21 16:15:06	1	1
49	1	19	2013-11-21 16:32:08	1	1
50	7	19	2013-11-21 16:32:10	1	1
51	7	9	2013-11-21 16:33:27	1	1
52	1	9	2013-11-21 16:33:28	1	1
53	6	13	2013-11-21 16:33:41	1	1
57	9	27	2013-11-22 09:19:39	1	1
58	6	27	2013-11-22 09:19:39	1	1
59	11	27	2013-11-22 09:19:40	1	1
63	1	28	2013-11-22 09:28:16	1	1
64	12	28	2013-11-22 09:28:16	1	1
65	10	28	2013-11-22 09:28:17	1	1
69	1	29	2013-11-22 09:38:22	1	1
70	10	29	2013-11-22 09:38:22	1	1
71	6	29	2013-11-22 09:38:22	1	1
72	1	30	2013-11-22 09:45:50	1	1
73	6	30	2013-11-22 09:45:50	1	1
74	6	31	2013-11-22 09:50:15	1	1
75	3	31	2013-11-22 09:50:15	1	1
76	3	32	2013-11-22 09:51:15	1	1
77	3	33	2013-11-22 09:53:32	1	1
78	15	34	2013-11-22 09:54:53	1	1
79	8	34	2013-11-22 09:54:53	1	1
80	1	34	2013-11-22 09:54:53	1	1
81	8	35	2013-11-22 09:55:30	1	1
82	15	35	2013-11-22 09:55:30	1	1
83	1	35	2013-11-22 09:55:30	1	1
84	16	36	2013-11-22 09:57:34	1	1
85	6	36	2013-11-22 09:57:34	1	1
86	1	36	2013-11-22 09:57:34	1	1
87	13	37	2013-11-22 09:58:08	1	1
88	1	37	2013-11-22 09:58:08	1	1
89	8	37	2013-11-22 09:58:08	1	1
90	1	38	2013-11-22 09:59:38	1	1
91	17	38	2013-11-22 09:59:53	1	1
92	18	39	2013-11-22 10:03:47	1	1
93	10	39	2013-11-22 10:03:47	1	1
94	12	39	2013-11-22 10:03:47	1	1
95	1	39	2013-11-22 10:03:47	1	1
96	7	40	2013-11-22 10:05:17	1	1
97	1	40	2013-11-22 10:05:17	1	1
98	19	41	2013-11-22 10:06:47	1	1
99	6	41	2013-11-22 10:06:47	1	1
100	6	10	2013-11-22 10:07:27	1	1
101	1	10	2013-11-22 10:07:29	1	1
102	1	42	2013-11-22 10:09:16	1	1
103	20	42	2013-11-22 10:09:16	1	1
104	8	43	2013-11-22 10:32:39	1	1
105	21	43	2013-11-22 10:32:39	1	1
106	22	44	2013-11-22 10:35:03	1	1
107	6	44	2013-11-22 10:35:03	1	1
108	1	44	2013-11-22 10:35:03	1	1
109	8	45	2013-11-22 10:37:24	1	1
110	15	45	2013-11-22 10:37:24	1	1
111	6	46	2013-11-22 10:39:19	1	1
112	1	46	2013-11-22 10:39:19	1	1
113	6	47	2013-11-22 10:39:51	1	1
114	1	48	2013-11-22 10:41:06	1	1
115	6	48	2013-11-22 10:41:06	1	1
116	6	49	2013-11-22 10:42:11	1	1
117	8	50	2013-11-22 10:43:15	1	1
118	3	50	2013-11-22 10:43:15	1	1
119	1	51	2013-11-22 10:47:38	1	1
120	7	51	2013-11-22 10:47:38	1	1
121	1	52	2013-11-22 10:48:58	1	1
122	10	53	2013-11-22 10:49:48	1	1
123	1	53	2013-11-22 10:49:48	1	1
124	1	54	2013-11-22 10:50:57	1	1
125	10	54	2013-11-22 10:50:57	1	1
126	6	55	2013-11-22 10:52:02	1	1
127	22	55	2013-11-22 10:52:02	1	1
128	1	55	2013-11-22 10:52:02	1	1
129	23	56	2013-11-22 10:53:28	1	1
130	1	56	2013-11-22 10:53:28	1	1
131	6	56	2013-11-22 10:53:28	1	1
132	1	57	2013-11-22 10:54:18	1	1
133	6	57	2013-11-22 10:54:18	1	1
134	3	57	2013-11-22 10:54:18	1	1
135	1	58	2013-11-22 10:55:09	1	1
136	7	58	2013-11-22 10:55:09	1	1
137	24	59	2013-11-22 10:57:05	1	1
138	3	59	2013-11-22 10:57:05	1	1
139	3	60	2013-11-22 10:57:59	1	1
140	24	60	2013-11-22 10:57:59	1	1
141	1	61	2013-11-22 10:59:19	1	1
142	6	61	2013-11-22 10:59:19	1	1
143	25	7	2013-11-22 11:00:34	1	1
144	1	7	2013-11-22 11:00:38	1	1
145	10	8	2013-11-22 11:00:51	1	1
146	8	8	2013-11-22 11:00:52	1	1
147	8	7	2013-11-22 11:01:09	1	1
148	1	4	2013-11-22 11:04:58	1	1
149	3	4	2013-11-22 11:04:59	1	1
150	24	4	2013-11-22 11:05:00	1	1
151	1	18	2013-11-22 11:06:09	1	1
152	8	18	2013-11-22 11:10:45	1	1
153	1	16	2013-11-22 11:14:10	1	1
154	3	16	2013-11-22 11:14:15	1	1
155	3	6	2013-11-22 11:14:33	1	1
156	1	6	2013-11-22 11:14:34	1	1
157	1	24	2013-11-22 11:14:55	1	1
158	1	13	2013-11-22 11:15:20	1	1
159	1	47	2013-11-22 11:18:39	1	1
160	1	49	2013-11-22 11:19:01	1	1
161	1	3	2014-12-01 21:19:09.3	1	1
162	6	3	2014-12-01 21:19:14.392	1	1
163	6	62	2014-12-01 21:34:32.249	1	1
164	1	62	2014-12-01 21:34:36.207	1	1
165	6	64	2014-12-01 21:37:21.983	1	1
166	1	64	2014-12-01 21:37:21.985	1	1
167	24	65	2014-12-01 21:42:33.382	1	1
168	26	65	2014-12-01 21:42:33.383	1	1
169	27	65	2014-12-01 21:42:33.384	1	1
170	6	66	2014-12-01 21:53:47.938	1	1
171	1	66	2014-12-01 21:53:47.94	1	1
172	28	66	2014-12-01 21:53:47.94	1	1
173	29	11	2014-12-01 21:57:01.529	1	1
174	29	10	2014-12-01 21:57:09.653	1	1
175	6	2	2014-12-01 21:57:22.213	1	1
176	29	2	2014-12-01 21:57:23.795	1	1
177	6	67	2014-12-01 22:03:30.719	1	1
178	1	67	2014-12-01 22:03:30.727	1	1
179	30	67	2014-12-01 22:03:30.728	1	1
180	6	68	2014-12-01 22:03:30.731	1	1
182	30	68	2014-12-01 22:03:30.742	1	1
186	6	70	2014-12-01 22:03:30.772	1	1
187	1	70	2014-12-01 22:03:30.772	1	1
188	30	70	2014-12-01 22:03:30.772	1	1
195	3	68	2014-12-01 22:21:29.406	1	1
196	12	68	2014-12-01 22:21:29.409	1	1
197	1	69	2014-12-01 22:26:04.643	1	1
198	6	69	2014-12-01 22:26:04.647	1	1
199	28	69	2014-12-01 22:26:04.648	1	1
200	31	69	2014-12-01 22:26:04.649	1	1
201	32	69	2014-12-01 22:26:04.65	1	1
202	7	70	2014-12-01 22:30:09.857	1	1
203	1	70	2014-12-01 22:30:09.862	1	1
204	12	70	2014-12-01 22:30:09.864	1	1
205	32	70	2014-12-01 22:30:09.865	1	1
206	24	71	2014-12-01 22:33:25.992	1	1
207	3	71	2014-12-01 22:33:25.997	1	1
208	27	71	2014-12-01 22:33:26	1	1
209	12	71	2014-12-01 22:33:26.001	1	1
210	33	72	2014-12-01 22:40:32.214	1	1
211	1	72	2014-12-01 22:40:32.216	1	1
212	34	72	2014-12-01 22:40:32.217	1	1
213	1	73	2014-12-01 22:46:41.156	1	1
214	10	73	2014-12-01 22:46:41.159	1	1
215	34	73	2014-12-01 22:46:41.159	1	1
216	6	74	2014-12-01 22:49:37.725	1	1
217	3	74	2014-12-01 22:49:37.727	1	1
218	12	74	2014-12-01 22:49:37.728	1	1
219	31	75	2014-12-01 22:55:04.829	1	1
220	1	75	2014-12-01 22:55:04.831	1	1
221	13	75	2014-12-01 22:55:04.832	1	1
222	35	75	2014-12-01 22:55:58.899	1	1
224	12	76	2014-12-02 10:07:29.458	1	1
225	31	76	2014-12-02 10:07:29.458	1	1
226	28	76	2014-12-02 10:07:29.459	1	1
223	1	76	2014-12-02 10:07:29.439	1	1
227	12	77	2014-12-02 10:14:01.326	1	1
228	3	77	2014-12-02 10:14:01.329	1	1
229	27	77	2014-12-02 10:14:01.33	1	1
230	36	77	2014-12-02 10:14:01.331	1	1
231	1	78	2014-12-02 10:21:40.11	1	1
232	10	78	2014-12-02 10:21:40.112	1	1
233	20	78	2014-12-02 10:21:40.113	1	1
234	6	79	2014-12-02 10:24:45.824	1	1
235	1	79	2014-12-02 10:24:45.826	1	1
236	37	47	2014-12-02 10:25:09.565	1	1
237	6	80	2014-12-02 10:32:01.731	1	1
238	38	80	2014-12-02 10:32:01.734	1	1
239	1	80	2014-12-02 10:32:01.735	1	1
240	12	81	2014-12-02 10:37:52.624	1	1
241	39	81	2014-12-02 10:37:52.627	1	1
242	28	81	2014-12-02 10:37:52.629	1	1
243	40	81	2014-12-02 10:37:52.629	1	1
244	41	81	2014-12-02 10:37:52.63	1	1
245	42	81	2014-12-02 10:37:52.631	1	1
246	6	82	2014-12-02 11:18:27.799	1	1
247	1	82	2014-12-02 11:18:27.804	1	1
248	7	82	2014-12-02 11:18:27.805	1	1
249	37	82	2014-12-02 11:18:27.806	1	1
250	6	83	2014-12-02 11:23:42.439	1	1
251	12	83	2014-12-02 11:23:42.442	1	1
252	28	83	2014-12-02 11:23:42.443	1	1
253	3	84	2014-12-02 11:28:29.239	1	1
254	42	84	2014-12-02 11:28:29.241	1	1
255	43	84	2014-12-02 11:28:29.241	1	1
256	13	85	2014-12-02 11:31:48.444	1	1
257	1	85	2014-12-02 11:31:48.446	1	1
258	6	86	2014-12-02 11:41:12.773	1	1
259	1	86	2014-12-02 11:41:12.775	1	1
260	44	86	2014-12-02 11:41:12.776	1	1
261	45	38	2014-12-02 11:45:06.626	1	1
262	1	87	2014-12-02 14:31:10.215	1	1
263	42	87	2014-12-02 14:31:10.221	1	1
264	46	87	2014-12-02 14:31:10.222	1	1
265	47	87	2014-12-02 14:31:10.223	1	1
266	28	87	2014-12-02 14:31:10.223	1	1
267	36	87	2014-12-02 14:31:10.226	1	1
268	43	87	2014-12-02 14:31:10.227	1	1
273	31	35	2014-12-02 21:30:46.518	1	1
274	4	11	2014-12-03 18:23:10.368	1	1
275	13	90	2014-12-04 09:52:21.092	1	1
276	1	90	2014-12-04 09:52:21.1	1	1
278	1	91	2014-12-14 18:28:46.271	1	1
277	48	91	2014-12-14 18:28:46.258	1	1
279	24	92	2014-12-14 18:36:45.765	1	1
280	49	92	2014-12-14 18:36:45.767	1	1
281	49	93	2014-12-14 18:45:58.7	1	1
282	26	93	2014-12-14 18:45:58.702	1	1
283	24	93	2014-12-14 18:45:58.703	1	1
284	24	94	2014-12-14 18:54:16.183	1	1
285	3	94	2014-12-14 18:54:16.183	1	1
286	26	95	2014-12-14 18:58:47.069	1	1
287	24	95	2014-12-14 18:58:47.071	1	1
288	24	96	2014-12-14 19:04:53.979	1	1
289	49	96	2014-12-14 19:04:53.981	1	1
290	45	96	2014-12-14 19:04:53.982	1	1
291	6	97	2014-12-15 17:36:58.867	1	1
292	12	97	2014-12-15 17:36:58.88	1	1
293	3	98	2014-12-15 17:46:18.278	1	1
294	42	98	2014-12-15 17:46:18.282	1	1
295	44	98	2014-12-15 17:46:18.283	1	1
296	6	99	2014-12-15 17:48:58.084	1	1
297	50	99	2014-12-15 17:48:58.087	1	1
298	24	100	2014-12-15 17:56:09.777	1	1
299	26	100	2014-12-15 17:56:09.782	1	1
300	26	101	2014-12-15 17:59:31.685	1	1
301	24	101	2014-12-15 17:59:31.693	1	1
302	8	101	2014-12-15 17:59:31.694	1	1
303	49	102	2014-12-15 18:17:25.613	1	1
304	24	102	2014-12-15 18:17:25.62	1	1
305	8	102	2014-12-15 18:17:25.622	1	1
306	26	102	2014-12-15 18:17:25.623	1	1
307	24	103	2014-12-15 18:23:32.694	1	1
308	26	103	2014-12-15 18:23:32.7	1	1
309	8	103	2014-12-15 18:23:32.701	1	1
310	26	104	2014-12-16 09:56:59.764	1	1
311	24	104	2014-12-16 09:56:59.768	1	1
312	51	104	2014-12-16 09:56:59.769	1	1
313	52	104	2014-12-16 09:56:59.77	1	1
314	3	105	2014-12-16 10:05:40.228	1	1
315	24	105	2014-12-16 10:05:40.232	1	1
316	53	105	2014-12-16 10:05:40.233	1	1
317	54	105	2014-12-16 10:05:40.234	1	1
318	53	106	2014-12-16 10:11:35.875	1	1
319	54	106	2014-12-16 10:11:35.883	1	1
320	3	106	2014-12-16 10:11:35.883	1	1
321	24	106	2014-12-16 10:11:35.884	1	1
322	55	106	2014-12-16 10:11:35.885	1	1
323	56	106	2014-12-16 10:11:35.886	1	1
324	44	106	2014-12-16 10:11:35.886	1	1
325	6	107	2014-12-16 10:17:09.584	1	1
326	28	107	2014-12-16 10:17:09.589	1	1
327	44	107	2014-12-16 10:17:09.59	1	1
328	55	76	2014-12-16 10:18:43.343	1	1
329	24	33	2014-12-16 10:18:59.952	1	1
330	57	33	2014-12-16 10:19:07.471	1	1
331	31	108	2014-12-16 10:26:17.971	1	1
332	11	108	2014-12-16 10:26:17.975	1	1
333	3	108	2014-12-16 10:26:17.976	1	1
334	54	108	2014-12-16 10:26:17.976	1	1
335	6	109	2014-12-16 10:31:53.957	1	1
336	22	109	2014-12-16 10:31:53.961	1	1
337	58	109	2014-12-16 10:31:53.962	1	1
338	44	49	2014-12-16 10:33:59.981	1	1
339	22	110	2014-12-16 10:36:42.319	1	1
340	6	110	2014-12-16 10:36:42.323	1	1
341	59	111	2014-12-16 10:41:28.215	1	1
342	40	111	2014-12-16 10:41:28.222	1	1
343	1	111	2014-12-16 10:41:28.223	1	1
344	28	111	2014-12-16 10:41:28.224	1	1
345	23	112	2014-12-16 10:45:17.363	1	1
346	1	112	2014-12-16 10:45:17.366	1	1
347	24	113	2014-12-16 11:00:00.659	1	1
348	53	113	2014-12-16 11:00:00.661	1	1
349	26	114	2014-12-16 11:14:14.037	1	1
350	24	114	2014-12-16 11:14:14.04	1	1
351	51	114	2014-12-16 11:14:14.041	1	1
352	24	115	2014-12-17 11:31:43.507	1	1
353	53	115	2014-12-17 11:31:43.511	1	1
354	60	115	2014-12-17 11:31:43.512	1	1
355	11	115	2014-12-17 11:31:43.522	1	1
356	24	116	2014-12-17 11:38:49.24	1	1
357	61	116	2014-12-17 11:38:49.242	1	1
358	62	117	2014-12-17 12:10:26.712	1	1
359	21	117	2014-12-17 12:10:26.716	1	1
360	13	117	2014-12-17 12:10:26.717	1	1
361	1	117	2014-12-17 12:10:26.718	1	1
362	21	118	2014-12-17 12:15:33.489	1	1
363	1	118	2014-12-17 12:15:33.491	1	1
364	12	118	2014-12-17 12:15:33.492	1	1
365	3	119	2014-12-17 12:18:37.214	1	1
366	1	120	2014-12-17 15:15:56.025	1	1
367	44	120	2014-12-17 15:15:56.028	1	1
368	6	120	2014-12-17 15:15:56.029	1	1
369	12	120	2014-12-17 15:15:56.03	1	1
370	24	121	2014-12-17 15:35:11.465	1	1
371	26	121	2014-12-17 15:35:11.47	1	1
372	63	121	2014-12-17 15:35:11.471	1	1
373	24	122	2014-12-17 16:26:38.929	1	1
374	26	122	2014-12-17 16:26:38.934	1	1
375	61	114	2014-12-18 21:34:37.975	1	1
376	61	60	2014-12-18 21:34:48.226	1	1
377	64	122	2014-12-18 21:35:04.58	1	1
378	64	95	2014-12-18 21:35:34.914	1	1
379	64	59	2014-12-18 21:36:02.526	1	1
380	52	93	2014-12-18 21:36:17.108	1	1
381	61	65	2014-12-18 21:36:44.893	1	1
382	61	4	2014-12-18 21:36:59.232	1	1
383	6	123	2014-12-18 21:46:05.049	1	1
384	3	123	2014-12-18 21:46:05.051	1	1
385	65	123	2014-12-18 21:46:05.053	1	1
386	66	123	2014-12-18 21:46:05.054	1	1
387	26	123	2014-12-18 21:46:20.113	1	1
388	44	123	2014-12-18 21:46:21.613	1	1
389	35	123	2014-12-18 21:46:33.44	1	1
390	3	124	2014-12-18 21:57:57.827	1	1
391	24	124	2014-12-18 21:57:57.83	1	1
392	53	124	2014-12-18 21:57:57.831	1	1
393	49	124	2014-12-18 21:57:57.832	1	1
394	44	124	2014-12-18 21:57:57.833	1	1
395	6	125	2014-12-18 22:15:57.723	1	1
396	3	125	2014-12-18 22:15:57.725	1	1
397	66	125	2014-12-18 22:15:57.726	1	1
398	24	126	2014-12-18 22:19:36.319	1	1
399	49	126	2014-12-18 22:19:36.321	1	1
400	1	127	2014-12-18 22:22:55.604	1	1
401	9	127	2014-12-18 22:22:55.606	1	1
402	20	127	2014-12-18 22:22:55.607	1	1
403	10	127	2014-12-18 22:22:55.608	1	1
404	6	128	2014-12-18 22:27:51.287	1	1
405	37	128	2014-12-18 22:27:51.29	1	1
406	56	128	2014-12-18 22:27:51.29	1	1
407	1	128	2014-12-18 22:27:51.291	1	1
408	24	129	2014-12-18 22:33:02.443	1	1
409	61	129	2014-12-18 22:33:02.445	1	1
410	49	129	2014-12-18 22:33:02.446	1	1
411	26	130	2014-12-19 16:04:46.288	1	1
412	24	130	2014-12-19 16:04:46.29	1	1
413	27	130	2014-12-19 16:04:46.291	1	1
414	64	130	2014-12-19 16:04:46.291	1	1
415	24	131	2014-12-19 16:38:04.487	1	1
416	26	131	2014-12-19 16:38:04.491	1	1
417	64	131	2014-12-19 16:38:04.492	1	1
418	63	131	2014-12-19 16:38:04.493	1	1
\.


--
-- TOC entry 3067 (class 0 OID 0)
-- Dependencies: 197
-- Name: taggame_TagGameID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"taggame_TagGameID_seq"', 418, true);


--
-- TOC entry 3068 (class 0 OID 0)
-- Dependencies: 199
-- Name: userLevel_UserLevelID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"userLevel_UserLevelID_seq"', 4, true);


--
-- TOC entry 3028 (class 0 OID 16484)
-- Dependencies: 198
-- Data for Name: userlevel; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY userlevel ("UserLevelID", "Name") FROM stdin;
1	Standard
2	Group Leader
3	Admin
4	Super Admin
\.


--
-- TOC entry 3030 (class 0 OID 16489)
-- Dependencies: 200
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: improvdatabase
--

COPY users ("UserID", "FirstName", "LastName", "Gender", "Email", "URL", "DateAdded", "DateModified", "Password", "UserLevel", "Locked", "Description") FROM stdin;
2	Testly	McTestington	M	t@mctestingtons.com	\N	2015-02-01 14:11:36.531	2015-02-01 14:11:36.531	$2a$10$FmvGP6YkOyTs3gDkBDaA5eXYpD5oUm96A07s4b2BgPVF.c55801ye	{1}	f	
5	Checkin	McTestington	F	check@mctestingtons.com	\N	2015-02-01 16:16:38.785	2015-02-01 16:16:38.785	$2a$10$4bkuolnzTt7rFW8Dt8Ufoek5p0ECWZM/RoWZlhHRLwPREyqPeNv3i	{1}	f	
1	Shauvon	McGill	M	smcgill@denyconformity.com	http://www.denyconformity.com	2014-12-01 12:06:35.098	2015-03-26 11:23:41.664	$2a$10$ReJF7DKap0UjXn.kbo449u5sHnHTvTRbXULUyBqa.3hQ1WXoQDBL2	{1,2,3,4}	f	A really quite cool dude.
\.


--
-- TOC entry 3069 (class 0 OID 0)
-- Dependencies: 201
-- Name: users_UserID_seq; Type: SEQUENCE SET; Schema: public; Owner: improvdatabase
--

SELECT pg_catalog.setval('"users_UserID_seq"', 5, true);


--
-- TOC entry 2862 (class 2606 OID 16518)
-- Name: duration_Name_key; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY duration
    ADD CONSTRAINT "duration_Name_key" UNIQUE ("Name");


--
-- TOC entry 2864 (class 2606 OID 16520)
-- Name: duration_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY duration
    ADD CONSTRAINT duration_pkey PRIMARY KEY ("DurationID");


--
-- TOC entry 2866 (class 2606 OID 16522)
-- Name: game_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY game
    ADD CONSTRAINT game_pkey PRIMARY KEY ("GameID");


--
-- TOC entry 2860 (class 2606 OID 16524)
-- Name: group_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY comedygroup
    ADD CONSTRAINT group_pkey PRIMARY KEY ("GroupID");


--
-- TOC entry 2868 (class 2606 OID 16526)
-- Name: name_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY name
    ADD CONSTRAINT name_pkey PRIMARY KEY ("NameID");


--
-- TOC entry 2870 (class 2606 OID 16528)
-- Name: note_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY note
    ADD CONSTRAINT note_pkey PRIMARY KEY ("NoteID");


--
-- TOC entry 2872 (class 2606 OID 16530)
-- Name: permissionkey_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY permissionkey
    ADD CONSTRAINT permissionkey_pkey PRIMARY KEY ("PermissionKeyID");


--
-- TOC entry 2874 (class 2606 OID 16532)
-- Name: permissionkeyuserlevel_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY permissionkeyuserlevel
    ADD CONSTRAINT permissionkeyuserlevel_pkey PRIMARY KEY ("PermissionKeyUserLevelID");


--
-- TOC entry 2876 (class 2606 OID 16534)
-- Name: playercount_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY playercount
    ADD CONSTRAINT playercount_pkey PRIMARY KEY ("PlayerCountID");


--
-- TOC entry 2878 (class 2606 OID 16536)
-- Name: suggestion_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY suggestion
    ADD CONSTRAINT suggestion_pkey PRIMARY KEY ("SuggestionID");


--
-- TOC entry 2880 (class 2606 OID 16538)
-- Name: suggestiontype_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY suggestiontype
    ADD CONSTRAINT suggestiontype_pkey PRIMARY KEY ("SuggestionTypeID");


--
-- TOC entry 2882 (class 2606 OID 16540)
-- Name: suggestiontypegame_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY suggestiontypegame
    ADD CONSTRAINT suggestiontypegame_pkey PRIMARY KEY ("SuggestionTypeGameID");


--
-- TOC entry 2884 (class 2606 OID 16542)
-- Name: tag_Name_key; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT "tag_Name_key" UNIQUE ("Name");


--
-- TOC entry 2886 (class 2606 OID 16544)
-- Name: tag_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY ("TagID");


--
-- TOC entry 2888 (class 2606 OID 16546)
-- Name: taggame_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY taggame
    ADD CONSTRAINT taggame_pkey PRIMARY KEY ("TagGameID");


--
-- TOC entry 2890 (class 2606 OID 16548)
-- Name: userLevel_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY userlevel
    ADD CONSTRAINT "userLevel_pkey" PRIMARY KEY ("UserLevelID");


--
-- TOC entry 2892 (class 2606 OID 16550)
-- Name: user_pkey; Type: CONSTRAINT; Schema: public; Owner: improvdatabase; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT user_pkey PRIMARY KEY ("UserID");


