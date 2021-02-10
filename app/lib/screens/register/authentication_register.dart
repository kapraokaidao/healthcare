import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/components/round_button.dart';
import 'package:healthcare_app/components/styled_text_form_field.dart';
import 'package:healthcare_app/repositories/index.dart';
import 'package:healthcare_app/screens/register/bloc/register_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/utils/http_client.dart';

class RegisterPage extends StatefulWidget {
  static route() {
    return MaterialPageRoute(builder: (_) => RegisterPage());
  }

  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final firstnameController = TextEditingController();
  final lastnameController = TextEditingController();
  final nationalIdController = TextEditingController();
  final pinController = TextEditingController();
  final phoneController = TextEditingController();
  final addressController = TextEditingController();
  final birthdateController = TextEditingController();
  String gender = 'Male';

  @override
  void initState() {
    super.initState();
    // BlocProvider.of<RegisterBloc>(context).add(RegisterStepChanged(RegisterStep.inputInfo));
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(builder: (ctx, state) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: Container(
            width: MediaQuery.of(context).size.width,
            height: MediaQuery.of(context).size.height,
            padding: EdgeInsets.symmetric(vertical: 64, horizontal: 32),
            decoration: BoxDecoration(
                image: DecorationImage(image: AssetImage('assets/images/background.png'), fit: BoxFit.cover)),
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    FractionallySizedBox(
                      child: Text("ชื่อ", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        controller: firstnameController,
                      ),
                    ),
                    FractionallySizedBox(
                      child: Text("นามสกุล", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        controller: lastnameController,
                      ),
                    ),
                    FractionallySizedBox(
                      child: Text("เลขประจำตัวประชาชน", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        controller: nationalIdController,
                      ),
                    ),
                    FractionallySizedBox(
                      child: Text("รหัส pin", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        controller: pinController,
                      ),
                    ),
                    FractionallySizedBox(
                      child: Text("เพศ", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: DropdownButton<String>(
                          value: gender,
                          onChanged: (String val) {
                            setState(() {
                              gender = val;
                            });
                          },
                          items: [
                            DropdownMenuItem<String>(
                              value: "Male",
                              child: Text("ชาย"),
                            ),
                            DropdownMenuItem<String>(
                              value: "Female",
                              child: Text("หญิง"),
                            ),
                          ]),
                    ),
                    FractionallySizedBox(
                      child: Text("เบอร์โทรศัพท์", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        controller: phoneController,
                      ),
                    ),
                    FractionallySizedBox(
                      child: Text("ที่อยู่", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        controller: addressController,
                      ),
                    ),
                    FractionallySizedBox(
                      child: Text("วันเกิด", style: TextStyle(fontSize: 16)),
                      widthFactor: 1,
                    ),
                    Container(
                      margin: EdgeInsets.only(top: 6, bottom: 16),
                      child: StyledTextFormField(
                        controller: birthdateController,
                      ),
                    ),
                    RoundButton(
                      title: "submit",
                      onPressed: () {
                        Map<String, dynamic> user = _createRegisterBody(
                          firstname: firstnameController.value.text,
                          lastname: lastnameController.value.text,
                          nationalId: nationalIdController.value.text,
                          pin: pinController.value.text,
                          phone: phoneController.value.text,
                          address: addressController.value.text,
                          birthdate: birthdateController.value.text,
                          gender: gender,
                        );
                        HttpClient.post('/auth/register', user);
                        print(jsonEncode(user));
                      },
                    )
                  ],
                ),
              ),
            )),
      );
    });
  }

  Map<String, dynamic> _createRegisterBody({
    String firstname,
    String lastname,
    String nationalId,
    String pin,
    String phone,
    String address,
    String birthdate,
    String gender,
  }) {
    var user = <String, dynamic>{};
    var patient = <String, dynamic>{};
    user["username"] = nationalId;
    user["password"] = pin;
    user["firstname"] = firstname;
    user["lastname"] = lastname;
    user["role"] = "Patient";
    user["phone"] = phone;
    user["address"] = address;

    patient["nationalId"] = nationalId;
    patient["gender"] = gender;
    patient["birthDate"] = birthdate;

    user["patient"] = patient;

    return user;
  }
/*
  *   final _formKey = GlobalKey<FormState>();
  final firstnameController = TextEditingController();
  final lastnameController = TextEditingController();
  final nationalIdController = TextEditingController();
  final pinController = TextEditingController();
  final phoneController = TextEditingController();
  final addressController = TextEditingController();
  final birthdateController = TextEditingController();
  String gender = '';*/
}
