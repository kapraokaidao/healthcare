import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/app.dart';
import 'package:healthcare_app/authentication/authentication.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/repositories/authentication_repository.dart';
import 'package:healthcare_app/screens/agreement/agreement_screen.dart';
import 'package:healthcare_app/screens/login/login_screen.dart';
import 'package:healthcare_app/screens/main_menu.dart';

class RegisterAwaitApproval extends StatefulWidget {
  static Route route() {
    return MaterialPageRoute(builder: (_) => RegisterAwaitApproval());
  }

  @override
  _RegisterAwaitApprovalState createState() => _RegisterAwaitApprovalState();
}

class _RegisterAwaitApprovalState extends State<RegisterAwaitApproval> {

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
          return Container(
            padding: EdgeInsets.all(100),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('awaiting approval'),
                  OutlineButton(
                    onPressed: () {
                      context
                          .read<AuthenticationBloc>()
                          .add(AuthenticationLogoutRequested());
                    },
                    child: Text('Logout'),
                  )
                ],
              ),
            ),
          );
        });
    return SingleChildScrollView(
      child: Padding(
        padding: EdgeInsets.symmetric(vertical: 64, horizontal: 32),
        child: Text('Awaiting approval')
      ),
    );
  }
}



