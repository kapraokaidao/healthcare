import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/repositories/index.dart';
import 'package:healthcare_app/screens/login/authentication_login.dart';
import 'package:healthcare_app/screens/main_menu.dart';
import 'package:healthcare_app/screens/register/authentication_register.dart';
import 'package:healthcare_app/screens/register/register_await_approval.dart';
import 'package:healthcare_app/screens/register/register_upload_kyc.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
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
        .add(AuthenticationValidateStatus());
  }

  @override
  void deactivate() {
    super.deactivate();
    context.read<AuthenticationBloc>()
        .add(AuthenticationValidateStatus());
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthenticationBloc, AuthenticationState>(
      listenWhen: (previous, current) => previous.status != current.status,
      listener: (context, state) {
        if (state.status == AuthenticationStatus.authenticated && state.step == AuthenticationStep.complete) {
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
              // current.status != AuthenticationStatus.authenticated || current.step != AuthenticationStep.complete,
              builder: (context, state) {
                Widget content;
                switch (state.step) {
                  case AuthenticationStep.login:
                    content = AuthenticationLogin();
                    break;
                  case AuthenticationStep.register:
                    content = RegisterPage();
                    break;
                  case AuthenticationStep.uploadKYC:
                    content = RegisterUploadKYC();
                    break;
                  case AuthenticationStep.awaitApproval:
                    content = RegisterAwaitApproval();
                    break;
                  default:
                    content = Container(child: Text(''));
                    break;
                }

                return Container(
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage('assets/images/background.png'),
                      fit: BoxFit.cover
                      // fit: BoxFit.scaleDown
                    )
                  ),
                  child: Scaffold(
                    backgroundColor: Colors.transparent,
                    body: ModalProgressHUD(
                      inAsyncCall: state.status == AuthenticationStatus.authenticating,
                      child: content
                    ),
                  )
                );
              }
          ),
        ),
      ),
    );
  }
}
