'use client';

/**
 * Phosphor Icons Compatibility Layer
 *
 * The codebase uses Ph-prefixed icon names (e.g. PhSparkle, PhArrowRight).
 * @phosphor-icons/react v2 exports WITHOUT the Ph prefix (Sparkle, ArrowRight).
 * This module re-exports all icons with both naming conventions.
 */

// Re-export everything from the real package (non-Ph names still work)
export * from '@phosphor-icons/react';

// CRITICAL: The local `import { X }` below shadows `export *` for those names.
// We must explicitly re-export every locally-imported icon so bare names work.
export {
  Heartbeat, ArrowBendUpLeft, ArrowCircleDown, ArrowCounterClockwise,
  ArrowDown, ArrowLeft, ArrowRight, ArrowSquareOut, ArrowUp, ArrowUpRight,
  ArrowsClockwise, ArrowsDownUp, ArrowsOut, Bell, Bird, Book, BookOpen,
  Bookmark, Books, BracketsSquare, BracketsCurly, Brain, Browser, Bug,
  Buildings, Calendar, CalendarDots, Camera, CaretDown, CaretLeft,
  CaretRight, CaretUp, Cat, ChartBar, Chat, ChatCircle, ChatCircleDots,
  ChatCircleText, ChatTeardrop, ChatText, Chats, Check, CheckCircle,
  Checks, Circle, CircleNotch, Clock, ClockCounterClockwise, Cloud,
  CloudSlash, Code, CodeBlock, Command, Compass, Copy, ArrowBendDownLeft,
  Cpu, Crown, Database, Diamond, DotsSixVertical, DotsThreeVertical,
  Download, Drop, Envelope, Eye, EyeSlash, Feather, File, FileCode,
  FileText, FilmStrip, Fire, Fish, Flame, FloppyDisk, FolderOpen, Funnel,
  GameController, Gear, GearSix, GitBranch, GithubLogo, Globe, GraduationCap,
  GridFour, GridNine, Heart, House, Image, ImageSquare, Info, Keyboard,
  Leaf, Lightbulb, Lightning, Link, List, ListDashes, ListNumbers, Lock,
  MagicWand, MagnifyingGlass, MapPin, MapTrifold,
  Microphone, Minus, Moon, Mountains, MusicNote, MusicNotes, Notebook,
  Package, PaintBrush, Palette, PaperPlane, Paperclip, Pen, Pencil,
  PencilSimple, Planet, Play, Plus, PushPin, Question, Quotes, Radio,
  Rocket, Scales, Scroll, Share, Shield, ShieldStar, Shuffle, SignOut,
  Skull, SlidersHorizontal, SortAscending, SortDescending, Sparkle,
  Spinner, Spiral, SplitHorizontal, SquaresFour, Stack, Star, Sun, Sword,
  Tag, Target, Terminal, TextAa, TextB, TextHOne, TextHTwo, TextItalic,
  TextT, Translate, Trash, Tree, TrendDown, TrendUp, Trophy, TwitterLogo,
  Upload, User, UserCircle, UserPlus, Users, VideoCamera, Warning,
  WarningCircle, Waves, WifiHigh, WifiSlash, Wind, Wrench, X, YoutubeLogo,
  Infinity as PhosphorInfinity,
} from '@phosphor-icons/react';

// Import all icons from the real package
import {
  Heartbeat,
  ArrowBendUpLeft,
  ArrowCircleDown,
  ArrowCounterClockwise,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  ArrowUp,
  ArrowUpRight,
  ArrowsClockwise,
  ArrowsDownUp,
  ArrowsOut,
  Bell,
  Bird,
  Book,
  BookOpen,
  Bookmark,
  Books,
  BracketsSquare,
  BracketsCurly,
  Brain,
  Browser,
  Bug,
  Buildings,
  Calendar,
  CalendarDots,
  Camera,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Cat,
  ChartBar,
  Chat,
  ChatCircle,
  ChatCircleDots,
  ChatCircleText,
  ChatTeardrop,
  ChatText,
  Chats,
  Check,
  CheckCircle,
  Checks,
  Circle,
  CircleNotch,
  Clock,
  ClockCounterClockwise,
  Cloud,
  CloudSlash,
  Code,
  CodeBlock,
  Command,
  Compass,
  Copy,
  ArrowBendDownLeft,
  Cpu,
  Crown,
  Database,
  Diamond,
  DotsSixVertical,
  DotsThreeVertical,
  Download,
  Drop,
  Envelope,
  Eye,
  EyeSlash,
  Feather,
  File,
  FileCode,
  FileText,
  FilmStrip,
  Fire,
  Fish,
  Flame,
  FloppyDisk,
  FolderOpen,
  Funnel,
  GameController,
  Gear,
  GearSix,
  GitBranch,
  GithubLogo,
  Globe,
  GraduationCap,
  GridFour,
  GridNine,
  Heart,
  House,
  Image,
  ImageSquare,
  Infinity as PhosphorInfinity,
  Info,
  Keyboard,
  Leaf,
  Lightbulb,
  Lightning,
  Link,
  List,
  ListDashes,
  ListNumbers,
  Lock,
  MagicWand,
  MagnifyingGlass,
  MapPin,
  MapTrifold,
  Microphone,
  Minus,
  Moon,
  Mountains,
  MusicNote,
  MusicNotes,
  Notebook,
  Package,
  PaintBrush,
  Palette,
  PaperPlane,
  Paperclip,
  Pen,
  Pencil,
  PencilSimple,
  Planet,
  Play,
  Plus,
  PushPin,
  Question,
  Quotes,
  Radio,
  Rocket,
  Scales,
  Scroll,
  Share,
  Shield,
  ShieldStar,
  Shuffle,
  SignOut,
  Skull,
  SlidersHorizontal,
  SortAscending,
  SortDescending,
  Sparkle,
  Spinner,
  Spiral,
  SplitHorizontal,
  SquaresFour,
  Stack,
  Star,
  Sun,
  Sword,
  Tag,
  Target,
  Terminal,
  TextAa,
  TextB,
  TextHOne,
  TextHTwo,
  TextItalic,
  TextT,
  Translate,
  Trash,
  Tree,
  TrendDown,
  TrendUp,
  Trophy,
  TwitterLogo,
  Upload,
  User,
  UserCircle,
  UserPlus,
  Users,
  VideoCamera,
  Warning,
  WarningCircle,
  Waves,
  WifiHigh,
  WifiSlash,
  Wind,
  Wrench,
  X,
  YoutubeLogo,
} from '@phosphor-icons/react';

import type { IconProps, PhosphorIcon as IconComponent } from '@phosphor-icons/react';

// Fallback for icons that don't exist in Phosphor but are used in the codebase
const Fallback = (() => null) as unknown as IconComponent;

// Ph-prefixed aliases — maps PhXxx to the real Phosphor icon Xxx
export const PhActivity = Heartbeat;
export const PhArrowBendUpLeft = ArrowBendUpLeft;
export const PhArrowCircleDown = ArrowCircleDown;
export const PhArrowClockwise = ArrowsClockwise;
export const PhArrowCounterClockwise = ArrowCounterClockwise;
export const PhArrowDown = ArrowDown;
export const PhArrowLeft = ArrowLeft;
export const PhArrowRight = ArrowRight;
export const PhArrowSquareOut = ArrowSquareOut;
export const PhArrowUp = ArrowUp;
export const PhArrowUpRight = ArrowUpRight;
export const PhArrowsClockwise = ArrowsClockwise;
export const PhArrowsDownUp = ArrowsDownUp;
export const PhArrowsOut = ArrowsOut;
export const PhBell = Bell;
export const PhBird = Bird;
export const PhBook = Book;
export const PhBookOpen = BookOpen;
export const PhBookmark = Bookmark;
export const PhBooks = Books;
export const PhBraces = BracketsSquare;
export const PhBracketsCurly = BracketsCurly;
export const PhBrain = Brain;
export const PhBrowser = Browser;
export const PhBug = Bug;
export const PhBuildings = Buildings;
export const PhCalendar = Calendar;
export const PhCalendarDots = CalendarDots;
export const PhCamera = Camera;
export const PhCaretDown = CaretDown;
export const PhCaretLeft = CaretLeft;
export const PhCaretRight = CaretRight;
export const PhCaretUp = CaretUp;
export const PhCat = Cat;
export const PhChartBar = ChartBar;
export const PhChat = Chat;
export const PhChatCircle = ChatCircle;
export const PhChatCircleDots = ChatCircleDots;
export const PhChatCircleText = ChatCircleText;
export const PhChatSquare = Chat;
export const PhChatTeardrop = ChatTeardrop;
export const PhChatText = ChatText;
export const PhChats = Chats;
export const PhCheck = Check;
export const PhCheckCircle = CheckCircle;
export const PhChecks = Checks;
export const PhChevronRight = CaretRight;
export const PhCircle = Circle;
export const PhCircleNotch = CircleNotch;
export const PhClock = Clock;
export const PhClockCounterClockwise = ClockCounterClockwise;
export const PhCloud = Cloud;
export const PhCloudSlash = CloudSlash;
export const PhCode = Code;
export const PhCodeBlock = CodeBlock;
export const PhCommand = Command;
export const PhCompass = Compass;
export const PhCopy = Copy;
export const PhCornerDownLeft = ArrowBendDownLeft;
export const PhCpu = Cpu;
export const PhCrown = Crown;
export const PhCrystals = Diamond;
export const PhDatabase = Database;
export const PhDiamond = Diamond;
export const PhDotsSixVertical = DotsSixVertical;
export const PhDotsThreeVertical = DotsThreeVertical;
export const PhDownload = Download;
export const PhDrop = Drop;
export const PhEnvelope = Envelope;
export const PhEye = Eye;
export const PhEyeSlash = EyeSlash;
export const PhFeather = Feather;
export const PhFile = File;
export const PhFileCode = FileCode;
export const PhFileQuestion = File;
export const PhFileText = FileText;
export const PhFilm = FilmStrip;
export const PhFilmStrip = FilmStrip;
export const PhFire = Fire;
export const PhFish = Fish;
export const PhFlame = Flame;
export const PhFloppyDisk = FloppyDisk;
export const PhFlow = Spiral;
export const PhFolderOpen = FolderOpen;
export const PhFunnel = Funnel;
export const PhGameController = GameController;
export const PhGear = Gear;
export const PhGitBranch = GitBranch;
export const PhGithubLogo = GithubLogo;
export const PhGlobe = Globe;
export const PhGraduationCap = GraduationCap;
export const PhGraphNetwork = Tree;
export const PhGridFour = GridFour;
export const PhGridNine = GridNine;
export const PhHeart = Heart;
export const PhHouse = House;
export const PhIcon = Sparkle;
export const PhImage = Image;
export const PhImageSquare = ImageSquare;
export const PhInfinity = PhosphorInfinity;
export const PhInfo = Info;
export const PhKey = Keyboard; // Key icon not available in this version, fallback to Keyboard
export const PhKeyboard = Keyboard;
export const PhLayers = Stack;
export const PhLeaf = Leaf;
export const PhLightbulb = Lightbulb;
export const PhLightning = Lightning;
export const PhLink = Link;
export const PhList = List;
export const PhListDashes = ListDashes;
export const PhListNumbers = ListNumbers;
export const PhLock = Lock;
export const PhMagicWand = MagicWand;
export const PhMagnifyingGlass = MagnifyingGlass;
export const PhMagnifyingGlassMinus = MagnifyingGlass;
export const PhMagnifyingGlassPlus = MagnifyingGlass;
export const PhMapPin = MapPin;
export const PhMapTrifold = MapTrifold;
export const PhMicrophone = Microphone;
export const PhMinus = Minus;
export const PhMoon = Moon;
export const PhMountains = Mountains;
export const PhMusicNote = MusicNote;
export const PhMusicNotes = MusicNotes;
export const PhNotebook = Notebook;
export const PhPackage = Package;
export const PhPaintBrush = PaintBrush;
export const PhPalette = Palette;
export const PhPaperPlane = PaperPlane;
export const PhPaperclip = Paperclip;
export const PhPen = Pen;
export const PhPencil = Pencil;
export const PhPencilSimple = PencilSimple;
export const PhPlanet = Planet;
export const PhPlanetX = Planet;
export const PhPlay = Play;
export const PhPlus = Plus;
export const PhPushPin = PushPin;
export const PhQuestion = Question;
export const PhQuotes = Quotes;
export const PhRadio = Radio;
export const PhRocket = Rocket;
export const PhScales = Scales;
export const PhScroll = Scroll;
export const PhShare = Share;
export const PhShell = Spiral;
export const PhShield = Shield;
export const PhShieldStar = ShieldStar;
export const PhShieldWarning = Shield;
export const PhShuffle = Shuffle;
export const PhSidebarOpen = List;
export const PhSidebarSimple = List;
export const PhSignOut = SignOut;
export const PhSkull = Skull;
export const PhSlidersHorizontal = SlidersHorizontal;
export const PhSortAscending = SortAscending;
export const PhSortDescending = SortDescending;
export const PhSparkle = Sparkle;
export const PhSpinner = Spinner;
export const PhSpiral = Spiral;
export const PhSplitHorizontal = SplitHorizontal;
export const PhSquaresFour = SquaresFour;
export const PhStack = Stack;
export const PhStar = Star;
export const PhSun = Sun;
export const PhSword = Sword;
export const PhTag = Tag;
export const PhTarget = Target;
export const PhTerminal = Terminal;
export const PhTextAa = TextAa;
export const PhTextB = TextB;
export const PhTextHOne = TextHOne;
export const PhTextHTwo = TextHTwo;
export const PhTextItalic = TextItalic;
export const PhTextT = TextT;
export const PhTranslate = Translate;
export const PhTrash = Trash;
export const PhTree = Tree;
export const PhTrendDown = TrendDown;
export const PhTrendUp = TrendUp;
export const PhTrophy = Trophy;
export const PhTwitterLogo = TwitterLogo;
export const PhUpload = Upload;
export const PhUser = User;
export const PhUserCheck = UserCircle;
export const PhUserPlus = UserPlus;
export const PhUsers = Users;
export const PhVideo = VideoCamera;
export const PhVideoCamera = VideoCamera;
export const PhWand = MagicWand;
export const PhWarning = Warning;
export const PhWarningCircle = WarningCircle;
export const PhWaves = Waves;
export const PhWifiHigh = WifiHigh;
export const PhWifiSlash = WifiSlash;
export const PhWind = Wind;
export const PhWrench = Wrench;
export const PhX = X;
export const PhYoutubeLogo = YoutubeLogo;
export const PhZap = Lightning;
export const PhExport = ArrowSquareOut;
export const PhTextAlignLeft = TextT;

// Ph-prefixed alias for GearSix
export const PhGearSix = GearSix;

// Lucide-style aliases (some files use Lucide naming conventions)
export const Sparkles = Sparkle;
export const Zap = Lightning;
export const Music = MusicNote;
export const Layers = Stack;
export const Search = MagnifyingGlass;
export const Film = FilmStrip;
export const Mic = Microphone;
export const MessageSquare = Chat;
export const Map = MapTrifold;
export const WindIcon = Wind;
export const Droplets = Drop;
export const Github = GithubLogo;

// Lucide chevron aliases → Phosphor caret equivalents
export const ChevronDown = CaretDown;
export const ChevronUp = CaretUp;
export const ChevronLeft = CaretLeft;
export const ChevronRight = CaretRight;

// Also export the fallback type for external use
export type { IconComponent as PhosphorIcon };

// Export the IconProps type so consumers can type icon prop interfaces
export type { IconProps };

// Type alias — some files import `Icon` as a type from this module
export type Icon = IconProps;

// Additional aliases for mythological icon system
export const PhSunHorizon = Sun;
export const PhFaders = SlidersHorizontal;
export const PhSealCheck = ShieldStar;

// Missing icon aliases — icons referenced but not in Phosphor
export const TreeStructure = GitBranch;   // Phosphor doesn't have TreeStructure
export const Gauge = Compass;             // Phosphor doesn't have Gauge — use Compass
export const ShieldCheck = Shield;        // Phosphor doesn't have ShieldCheck
