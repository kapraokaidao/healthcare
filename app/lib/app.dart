import 'package:healthcare_app/authentication/authentication.dart';
import 'package:healthcare_app/repositories/index.dart';
import 'package:healthcare_app/screens/main_menu.dart';
import 'package:healthcare_app/screens/redeem/redeem_screen.dart';
import 'package:healthcare_app/screens/token/token_screen.dart';
import 'package:healthcare_app/theme/theme.dart';
import 'package:provider/provider.dart';
import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:healthcare_app/models/NavItem.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';

class MyApp extends StatelessWidget {
  const MyApp({
    Key key,
    @required this.authenticationRepository,
    @required this.userRepository,
  })  : assert(authenticationRepository != null),
        assert(userRepository != null),
        super(key: key);

  final AuthenticationRepository authenticationRepository;
  final UserRepository userRepository;

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiRepositoryProvider(
        providers: [
          RepositoryProvider<AuthenticationRepository>(
            create: (context) => AuthenticationRepository(),
          ),
        ],
        child: MultiBlocProvider(
          providers: [
            BlocProvider<AuthenticationBloc>(
                create: (BuildContext context) => AuthenticationBloc(
                      authenticationRepository: authenticationRepository,
                      userRepository: userRepository,
                    )),
            // BlocProvider<HomeBloc>(
            //   create: (_) => HomeBloc(doctorRepository: doctorRepository),
            // ),
            // BlocProvider<DoctorCatalogBloc>(
            //   create: (_) =>
            //       DoctorCatalogBloc(doctorRepository: doctorRepository),
            // ),
            // BlocProvider<DoctorBloc>(
            //   create: (_) => DoctorBloc(doctorRepository: doctorRepository),
            // ),
            // BlocProvider<SymptomFormBloc>(
            //   create: (_) =>
            //       SymptomFormBloc(symptomRepository: symptomRepository),
            // ),
            // BlocProvider<SymptomSuggestionBloc>(
            //   create: (_) => SymptomSuggestionBloc(
            //       symptomKeywordRepository: symptomKeywordRepository),
            // ),
            // BlocProvider<ExaminationRoomLobbyBloc>(
            //   create: (_) => ExaminationRoomLobbyBloc(
            //       examinationRoomRepository: examinationRoomRepository),
            // ),
            // BlocProvider<TermAndConditionBloc>(
            //   create: (_) =>
            //       TermAndConditionBloc(userRepository: userRepository),
            // ),
            // BlocProvider<InboxBloc>(
            //   create: (_) =>
            //       InboxBloc(inboxMessageRepository: inboxMessageRepository),
            // ),
            // BlocProvider<SymptomSummaryBloc>(
            //   create: (_) =>
            //       SymptomSummaryBloc(symptomRepository: symptomRepository),
            // ),
          ],
          child: AppView(),
        ));
  }
}

class AppView extends StatefulWidget {
  @override
  _AppViewState createState() => _AppViewState();
}

class _AppViewState extends State<AppView> {
  final _navigatorKey = GlobalKey<NavigatorState>();
  NavigatorState get _navigator => _navigatorKey.currentState;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () {
          WidgetsBinding.instance.focusManager.primaryFocus?.unfocus();
        },
        child: MaterialApp(
          navigatorKey: _navigatorKey,
          title: 'Healthcare App',
          theme: defaultTheme,
          builder: (context, child) {
            return BlocListener<AuthenticationBloc, AuthenticationState>(
              listenWhen: (previous, current) =>
                  previous.status != current.status ||
                  previous.step != current.step,
              listener: (context, state) {
                if (state.status == AuthenticationStatus.unauthenticated) {
                  _navigator.push(AuthenticationPage.route(MainMenu.route()));
                }
              },
              child: child,
            );
          },
          onGenerateRoute: (s) {
            return MainMenu.route();
          },
        ));
  }

  // @override
  // Widget build(BuildContext context) {
  //   return ChangeNotifierProvider(
  //     create: (context) => NavItems(),
  //     child: MaterialApp(
  //       debugShowCheckedModeBanner: false,
  //       title: 'Healthcare App',
  //       theme: ThemeData(
  //         // backgroundColor: Colors.white,
  //         scaffoldBackgroundColor: Colors.white,
  //         // We apply this to our appBarTheme because most of our appBar have this style
  //         appBarTheme: AppBarTheme(color: Colors.white, elevation: 0),
  //         visualDensity: VisualDensity.adaptivePlatformDensity,
  //       ),
  //       home: RedeemScreen(),
  //     ),
  //   );
  // }
}

// @override
// Widget build(BuildContext context) {
//   return ChangeNotifierProvider(
//     create: (context) => NavItems(),
//     child: MaterialApp(
//       debugShowCheckedModeBanner: false,
//       title: 'Healthcare App',
//       theme: ThemeData(
//         // backgroundColor: Colors.white,
//         scaffoldBackgroundColor: Colors.white,
//         // We apply this to our appBarTheme because most of our appBar have this style
//         appBarTheme: AppBarTheme(color: Colors.white, elevation: 0),
//         visualDensity: VisualDensity.adaptivePlatformDensity,
//       ),
//       home: StartScreen(),
//     ),
//   );
// }
