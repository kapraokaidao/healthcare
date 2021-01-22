import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:healthcare_app/components/styled_text_form_field.dart';

import 'package:healthcare_app/components/round_button.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';

class AuthenticationLogin extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();
  final RegExp _nationalIdRegex = RegExp(r'^[a-z0-9]+$');
  final RegExp _pinRegExp = RegExp(r'^[a-z0-9]+$');

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        buildWhen: (previous, current) => previous.nationalId != current.nationalId,
        builder: (context, state) {
          return Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Container(
                    margin: EdgeInsets.symmetric(vertical: 40, horizontal: 0),
                    child: Text(
                      "เข้าสู่ระบบ",
                      style: TextStyle(
                          color: Theme.of(context).primaryColor,
                          fontSize: 30,
                          fontWeight: FontWeight.normal,
                          decoration: TextDecoration.none),
                    ),
                  ),
                  FractionallySizedBox(
                    child: Text("เลขประจำตัวประชาชน"),
                    widthFactor: 1,
                  ),
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Container(
                            child: StyledTextFormField(
                              keyboardType: TextInputType.phone,
                              validator: (value) {
                                if (value.isEmpty) {
                                  return 'กรุณากรอกเลขประจำตัวประชาชน';
                                }
                                if (!_nationalIdRegex.hasMatch(value)) {
                                  return 'กรุณากรอกเลขประจำตัวประชาชนให้ถูกต้อง';
                                }
                                return null;
                              },
                              onChanged: (nationalId) => context
                                  .watch<AuthenticationBloc>()
                                  .add(AuthenticationNationalIdChanged(nationalId)),
                            )),
                      )
                    ],
                  ),
                  Container(
                    margin: EdgeInsets.only(top: 12),
                    child: FractionallySizedBox(
                      child: Text("รหัส pin 6 หลัก"),
                      widthFactor: 1,
                    ),
                  ),
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Container(
                            child: StyledTextFormField(
                              keyboardType: TextInputType.phone,
                              obscureText: true,
                              validator: (value) {
                                if (value.isEmpty) {
                                  return 'กรุณากรอก pin';
                                }
                                if (!_pinRegExp.hasMatch(value)) {
                                  return 'กรุณากรอก pin ให้ถูกต้อง';
                                }
                                return null;
                              },
                              onChanged: (pin) => context
                                  .watch<AuthenticationBloc>()
                                  .add(AuthenticationPinChanged(pin)),
                            )),
                      )
                    ],
                  ),
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Container(
                          margin:
                          EdgeInsets.symmetric(vertical: 24, horizontal: 0),
                          child: RoundButton(
                            title: "เข้าสู่ระบบ",
                            onPressed: () {
                              if (_formKey.currentState.validate()) {
                                context
                                    .watch<AuthenticationBloc>()
                                    .add(AuthenticationCredentialsSubmitted());
                              }
                            },
                            textColor: Color.fromRGBO(255, 255, 255, 1),
                          ),
                        ),
                      )
                    ],
                  ),
                  // Container(
                  //   child: Button("contact",
                  //       textAlign: TextAlign.center,
                  //       style: TextStyle(
                  //         fontSize: 20,
                  //         fontWeight: FontWeight.normal,
                  //         decoration: TextDecoration.none,
                  //       )),
                  // )
                ],
              ));
        });
  }
}
