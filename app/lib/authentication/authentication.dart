import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/authentication/authentication_login.dart';
import 'package:healthcare_app/repositories/index.dart';
import 'package:healthcare_app/screens/main_menu.dart';
import 'package:modal_progress_hud/modal_progress_hud.dart';

// import 'package:modal_progress_hud/modal_progress_hud.dart';

class AuthenticationPage extends StatefulWidget {
  final Route<Object> redirectRoute;

  // static Route route(Route redirect) {
  //   return MaterialPageRoute(builder: (_) => AuthenticationPage(redirectRoute: redirect));
  // }

  static Route route(Route redirect) {
    return PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) =>
            AuthenticationPage(redirectRoute: redirect),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        });
  }

  const AuthenticationPage({this.redirectRoute});

  @override
  _AuthenticationPageState createState() => _AuthenticationPageState();
}

class _AuthenticationPageState extends State<AuthenticationPage> {
  @override
  void initState() {
    super.initState();
    context.read<AuthenticationBloc>()
        .add(AuthenticationStepChanged(AuthenticationStep.inputCredential));
  }

  @override
  void deactivate() {
    super.deactivate();
    context.read<AuthenticationBloc>()
        .add(AuthenticationStepChanged(AuthenticationStep.unknown));
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthenticationBloc, AuthenticationState>(
      listenWhen: (previous, current) => previous.status != current.status,
      listener: (context, state) {
        if (state.status == AuthenticationStatus.authenticated) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (widget.redirectRoute != null) {
              Navigator.pushReplacement(context, widget.redirectRoute);
            } else {
              Navigator.pop(context);
            }
          });
        }
      },
      child: Scaffold(
        appBar: PreferredSize(
            child: AppBar(
              brightness: Brightness.light,
              backgroundColor: Colors.transparent,
              shadowColor: Colors.transparent,
            ),
            preferredSize: Size.fromHeight(0)
        ),
        body: Container(
          child: BlocBuilder<AuthenticationBloc, AuthenticationState>(
              buildWhen: (previous, current) =>
              previous.step != current.step || previous.status != current.status,
              builder: (context, state) {
                Widget content;
                switch (state.step) {
                  case AuthenticationStep.inputCredential:
                    content = AuthenticationLogin();
                    break;
                  // case AuthenticationStep.inputOTP:
                  //   content = AuthenticationOTP();
                  //   break;
                  default:
                    content = Container(child: Text('Something went wrong'));
                    break;
                }

                return ModalProgressHUD(
                  inAsyncCall: state.status == AuthenticationStatus.authenticating,
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(32, 64, 32, 64),
                    child: content,
                  ),
                );
              }
          ),
        ),
      ),
    );
  }
}
