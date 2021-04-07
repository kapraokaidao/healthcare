import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/app.dart';
import 'package:healthcare_app/authentication/authentication.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/repositories/authentication_repository.dart';
import 'package:healthcare_app/screens/agreement/agreement_screen.dart';
import 'package:healthcare_app/screens/login/login_screen.dart';
import 'package:healthcare_app/screens/main_menu.dart';

class Body extends StatelessWidget {
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
              Column(
                children: [
                  Text('Healthcare'),
                  Text('ยินดีต้อนรับ: ${state.user?.username}'),
                  Text(
                      'ชื่อ: ${state.user?.firstname} ${state.user?.lastname}'),
                  Text('เบอร์โทร: ${state.user?.phone}'),
                  Text('ที่อยู่: ${state.user?.address}'),
                ],
              ),
              OutlineButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    AgreementScreen.route(),
                  );
                },
                child: Text('ถัดไป'),
              ),
              OutlineButton(
                onPressed: () {
                  context
                      .read<AuthenticationBloc>()
                      .add(AuthenticationLogoutRequested());
                },
                child: Text('ออกจากระบบ'),
              )
            ],
          ),
        ),
      );
    });
  }
}
